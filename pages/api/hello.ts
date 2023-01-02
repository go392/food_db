// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { calcAminoAcidScore } from '../../constants/amino_acid';
import { FoodData } from '../../utils/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const all = FoodData.getAll(0xfffff, 0x2);
  const r = FoodData.sort(FoodData.arrayExec(all, calcAminoAcidScore, []), ["amino_acid", "アミノ酸スコア"], true);
  
  res.status(200).json(r);
}
