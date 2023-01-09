import type { NextApiRequest, NextApiResponse } from 'next'
import foodGroupList from '../../jsondata/search.json'

type FoodList = {
    name: string,
    id: string,
  }
  
  type FoodListSearchResponse = {
    data?:FoodList[],
    status: string,
    message?: string,
  };

function searchData(query:string) : FoodListSearchResponse{
    if(query == "") return {status:"success", data:[]}
  
    let search_words:string[];
    search_words = query.split(' ');
  
    let ret : FoodListSearchResponse = {status:"success"};
    ret.data = [];
    for(let d of foodGroupList){
      for(let i in d.data){
        let match = true;
        for(let j of search_words){
          if(!(d.data as any)[i].name.includes(j) && !((d.data as any)[i].alias && ((d.data as any)[i].alias as string).includes(j))){
             match = false;
             break;
          }
        }
        if(match)ret.data.push({name: (d.data as any)[i].name as string, id: i});
      }
    }
    return ret;
  }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if(typeof req.query["q"] == 'string'){
    res.json(searchData(req.query["q"] as string))
  } else{
    res.json({});
  }
}