
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllFoodList, getFoodTables, getFoodListFromGroup, getGroup, getFoodData } from '../../utils/data';

type GetDataResponse = {
  data?: any,
  status: string,
  message?: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetDataResponse>
) {
  if(!req.query["id"]){
    if(req.query["group"]){
      let data= getFoodListFromGroup(req.query["group"] as string);
      res.status(200).json({status:"success", data});
    } else {
      let list =  getAllFoodList();
      let data =list.map((v:string)=>getFoodTables(v));
      res.status(200).json({status:"success", data});
    }
    return;
  }
  let id: string = req.query["id"] as string;
  let files = getFoodTables(id);
  if(!req.query["table"]){
    res.status(200).json({status:"success", data:files});
    return;
  }
  let table:string = req.query["table"] as string;

  let data = getFoodData(id, table);
  res.status(200).json({status:"success", data});
}
