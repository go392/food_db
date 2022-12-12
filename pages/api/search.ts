
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";

type FoodList = {
  name: string,
  id: string,
}

type FoodListSearchResponse = {
  data?:FoodList[],
  status: string,
  message?: string,
};

function Search(query:string) : FoodListSearchResponse{
  if(query == "") return {status:"success", data:[]}

  let search_words:string[];
  search_words = query.split(' ');
  let data: any[] = [];
  try{
    let files = fs.readdirSync("./jsondata/group/", undefined);
    data = files.map((value:string)=>{
      let d = fs.readFileSync(`./jsondata/group/${value}`, undefined);
      return JSON.parse(d.toString());
    })
  }catch(err){
    return {message:(err as Object).toString(), status:"error"};
  }

  let ret : FoodListSearchResponse = {status:"success"};
  ret.data = [];
  for(let d of data){
    for(let i in d.data){
      let match = true;
      for(let j of search_words){
        if(!d.data[i].name.includes(j) && !(d.data[i].alias && d.data[i].alias.includes(j))){
           match = false;
           break;
        }
      }
      if(match)ret.data.push({name: d.data[i].name as string, id: i});
    }
  }
  return ret;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<FoodListSearchResponse>) {
  res.status(200).json(Search(req.query["q"] as string));
}
