
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

type GetDataResponse = {
  data?: any,
  status: string,
  message?: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetDataResponse>
) {
  try{
    if(!req.query["id"]){
      let list:string[] =  fs.readdirSync(`./jsondata/group`, undefined);
      if(req.query["group"]){
        let data: object = JSON.parse(fs.readFileSync(`./jsondata/group/${req.query["group"]}.json`).toString());
        res.status(200).json({status:"success", data});
      } else {
        let data : object[] =list.map((v) =>JSON.parse(fs.readFileSync(`./jsondata/group/${v}`).toString()));
        res.status(200).json({status:"success", data});
      }
      
      return;
    }
    let id: string = req.query["id"] as string;

    let files:string[] = fs.readdirSync(`./jsondata/${id}`, undefined);
    if(!req.query["table"]){
      files = files.map((v) => path.parse(v).name);
      res.status(200).json({status:"success", data:files});
      return;
    }
    let table:string = req.query["table"] as string;

    let data = JSON.parse(fs.readFileSync(`./jsondata/${id}/${table}.json`).toString());
    res.status(200).json({status:"success", data});
  }catch(e){
    res.status(400).json({message:(e as object).toString(), status:"error"});
    return;
  }
}
