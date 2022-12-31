// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FoodDataFunc, getFoodData } from '../../utils/data';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const food_list = getFoodData(0xffff, 0xffff)[0];
  const mul = FoodDataFunc.mul(food_list, 50);
  res.status(200).json(mul);
}
