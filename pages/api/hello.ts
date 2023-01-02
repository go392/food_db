// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { essential_amino_acid_2007 } from '../../constants/amino_acid';
import { FoodData } from '../../utils/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const all = FoodData.getAll(0xfffff, 0x2);

  const func=(fd:FoodData):FoodData|undefined =>{
    const f = FoodData.contains(fd, essential_amino_acid_2007);
    if(!f) return undefined;
    const name = FoodData.extract(fd, ["amino_acid", "食品名"]);
    if(!name) return undefined;
    const protein = FoodData.extract(fd, ["amino_acid", "アミノ酸組成によるたんぱく質"]);
    if(!protein) return undefined;
    const amino_acid = FoodData.extract(fd, essential_amino_acid_2007);
    if(!amino_acid) return undefined;
    const amino_acid_per_protein= FoodData.div(amino_acid, protein);
    const amino_acid_per_essential= FoodData.mul(FoodData.div(amino_acid_per_protein, essential_amino_acid_2007), 100);
    const is_limiting_amino_acid =FoodData.lt(amino_acid_per_essential, 100);
    const amino_acid_score = FoodData.minValue(amino_acid_per_essential, ["amino_acid", "アミノ酸スコア"]);
    const limiting_amino_acids = FoodData.trueItems(is_limiting_amino_acid, ["amino_acid", "制限アミノ酸"]);
    return FoodData.merge(name, FoodData.merge(amino_acid_score, FoodData.merge(amino_acid_per_essential, limiting_amino_acids)));
  }

  const r = FoodData.arrayExec(all, func, []).sort((a, b) => {
    return (a.data["amino_acid"]["アミノ酸スコア"].number as number) > (b.data["amino_acid"]["アミノ酸スコア"].number as number) ? -1: 1;
  });
  
  res.status(200).json(r);
}
