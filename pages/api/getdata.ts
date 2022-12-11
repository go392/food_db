
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
      let list:string[] =  fs.readdirSync(`./jsondata`, undefined);
      list = list.filter((s:string, v:number, a:string[]) => s != "unit" && s!="group");
      res.status(200).json({status:"success", data:list});
      return;
    }
    if(typeof req.query["id"] != "string"){
      res.status(400).json({ status:"fail", message:"require query id as string"});
      return;
    }
    let id: string = req.query["id"] as string;

    let files:string[] = fs.readdirSync(`./jsondata/${id}`, undefined);
    if(files.length == 0){
      res.status(400).json({status:"fail", message:"table of id is not exist"});
      return;
    }
    if(!req.query["table"]){
      files = files.map((v) => path.parse(v).name);
      res.status(200).json({status:"success", data:files});
      return;
    }
    if(typeof req.query["table"] != "string"){
      res.status(400).json({ status:"fail", message:"table query parse failed"});
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
