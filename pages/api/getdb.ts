import { NextApiRequest, NextApiResponse } from 'next';
import food_db from '../../jsondata/fooddb.json'
import { FoodData } from '../../utils/calc';

export type GetDBResponse = {
  data?:FoodData[],
  status: string,
  message?: string,
};


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if(typeof req.query["list"] == 'string'){
    const list :string[] = req.query["list"].split(",");
    res.json({status:"success", data:list.map((v)=> {return {id:v, data:food_db[v as keyof typeof food_db]}}).filter((v)=>v.data)});
  } else{
    res.json({status:"success", data:Object.entries(food_db).map(([k,v])=>{return {id: k, data:v}})});
  }
}