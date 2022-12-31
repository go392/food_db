// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FoodDataFunc, getFoodData } from '../../utils/data';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const food_list = getFoodData(0xfffff, 0xfffff);
  const mul = FoodDataFunc.arrayExec(food_list, FoodDataFunc.mul, [50]);
  res.status(200).json(mul[2]);
}
