// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FoodData } from '../../utils/data';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const food_list = FoodData.getAll(0xfffff, 0xfffff);
  const mul = FoodData.arrayExec(food_list, FoodData.mul, [50]);
  res.status(200).json(mul[2]);
}
