import type { NextApiRequest, NextApiResponse } from 'next'
import { FoodGroup } from '../../utils/data';
import fg01 from '../../jsondata/group/01.json'
import fg02 from '../../jsondata/group/02.json'
import fg03 from '../../jsondata/group/03.json'
import fg04 from '../../jsondata/group/04.json'
import fg05 from '../../jsondata/group/05.json'
import fg06 from '../../jsondata/group/06.json'
import fg07 from '../../jsondata/group/07.json'
import fg08 from '../../jsondata/group/08.json'
import fg09 from '../../jsondata/group/09.json'
import fg10 from '../../jsondata/group/10.json'
import fg11 from '../../jsondata/group/11.json'
import fg12 from '../../jsondata/group/12.json'
import fg13 from '../../jsondata/group/13.json'
import fg14 from '../../jsondata/group/14.json'
import fg15 from '../../jsondata/group/15.json'
import fg16 from '../../jsondata/group/16.json'
import fg17 from '../../jsondata/group/17.json'
import fg18 from '../../jsondata/group/18.json'

const foodGroupList = [
  fg01,
  fg02, 
  fg03, 
  fg04, 
  fg05, 
  fg06, 
  fg07, 
  fg08, 
  fg09, 
  fg10, 
  fg11, 
  fg12, 
  fg13, 
  fg14, 
  fg15, 
  fg16, 
  fg17, 
  fg18, 
];

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