
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllFoodList, getFoodTableList, getFoodListFromGroup, getGroup, getFoodData, getFoodTable } from '../../utils/data';

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
      let data =list.map((v:string)=>getFoodTableList(v));
      res.status(200).json({status:"success", data});
    }
    return;
  }
  let id: string = req.query["id"] as string;
  let files = getFoodTableList(id);
  if(!req.query["table"]){
    res.status(200).json({status:"success", data:files});
    return;
  }
  let table:string = req.query["table"] as string;

  let data = getFoodTable(id, table);
  res.status(200).json({status:"success", data});
}
