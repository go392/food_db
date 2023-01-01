
import type { NextApiRequest, NextApiResponse } from 'next'
import {  FoodTable, FoodGroup } from '../../utils/data';

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
      let data= FoodGroup.fromGroup(req.query["group"] as string);
      res.status(200).json({status:"success", data});
    } else {
      let list =  FoodGroup.getList();
      let data =list.map((v:string)=>FoodGroup.fromGroup(v));
      res.status(200).json({status:"success", data});
    }
    return;
  }
  let id: string = req.query["id"] as string;
  let files = FoodTable.getList(id);
  if(!req.query["table"]){
    res.status(200).json({status:"success", data:files});
    return;
  }
  let table:string = req.query["table"] as string;

  let data = FoodTable.get(id, table);
  res.status(200).json({status:"success", data});
}
