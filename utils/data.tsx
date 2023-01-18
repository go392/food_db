import fs from 'fs';
import path from 'path';
import rows from '../data/rows';
import { table_name } from '../data/table';
import foodGroupList from '../jsondata/search.json'
import { FoodTable, FoodValue, FoodData } from './calc';

export type FoodIndex = {
    name:string,
    alias?:string,
}

export type FoodGroup = {
    id:string,
    name: string;
    data: Record<string, FoodIndex>;
}

export namespace FoodGroupServer{
  export function getList() : string[]{
    return foodGroupList.map((e) => e.id);
  }
  export function fromGroup(g:string):FoodGroup{
    return foodGroupList[parseInt(g)-1] as unknown as FoodGroup;
  }
}

export namespace FoodTableServer{
  export function getAllList():string[]{
    let paths: string[]=[];
    try{
      paths = fs.readdirSync("./jsondata/foodlist", undefined);
      paths = paths.filter((v) => v != "unit");
    }catch(err){
      console.log(err);
    }
    return paths;
  }

  export function getList(f:string):string[]{
    let paths: string[]=[];
    try{
      let pa =`./jsondata/foodlist/${f}`;
      if(!fs.existsSync(pa)){
        return [];
      }
      paths = fs.readdirSync(pa, undefined);
      paths = paths.map((v)=> path.parse(v).name).sort((a, b) =>{
        return Object.keys(table_name).indexOf(a) > Object.keys(table_name).indexOf(b) ? 1: -1;
      });
    }catch(err){
      console.log(err);
    }
    return paths;
  }

  export function get(id:string, t:string) : FoodTable | undefined{
    let data: FoodTable = {};
    try{
      let pa = `./jsondata/foodlist/${id}/${t}.json`;
      if(!fs.existsSync(pa)){
        return undefined;
      }
      data = JSON.parse(fs.readFileSync(pa).toString());
    }catch(e){
        console.log(e);
    }
    return data;
  }
  export function getAllFoodItems(): Record<string, string[]> {
    let items :Record<string, string[]> = {
      "栄養素": Object.entries(get("unit", "nutrients") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
      "アミノ酸":Object.entries(get("unit", "amino_acid") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
      "脂肪酸":Object.entries(get("unit", "fatty_acid") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
      "炭水化物":Object.entries(get("unit", "carbohydrate") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
      "食物繊維":Object.entries(get("unit", "fiber") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
      "有機酸":Object.entries(get("unit", "organic_acid") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
    };
  
    return items;
  }
}

export namespace FoodDataServer{
  export function getAll(group:number=0x3ff, table:number=0x3f):FoodData[]{
    let list : FoodGroup[] = [];
    for (let i = 0; i<18; i++){
      if(group & (1<<i)){
        let g = (i+1).toString().padStart(2, '0');
        list.push(FoodGroupServer.fromGroup(g));
      }
    }
    let ret :Record<string, Record<string, FoodTable>> = {};
    for(let i in list){
      for(let j in list[i].data){
        ret[j] = {};
      }
      
    } 
    const func = (t:string) => {
      if(table & FoodTable.tableMask(t)){
        for(let i in list){
          for(let j in list[i].data){
            let f =  FoodTableServer.get(j, t);
            if(f){
              ret[j][t] =f;
            }
          }
        }
      }
    };
    func("nutrients");
    func("amino_acid");
    func("fatty_acid");
    func("carbohydrate");
    func("fiber");
    func("organic_acid");
  
    return Object.entries(ret).map(([k,v]:[string, Record<string, FoodTable>])=>{
      return {id:k, data:v}
    });
  }
}




