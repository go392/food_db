import fs, { existsSync } from 'fs';
import path from 'path';

export function getGroup() : string[]{
    let paths: string[]=[];
    try{
      paths = fs.readdirSync("./jsondata/group", undefined);
      paths= paths.map((value:string) => path.parse(value).name);
    }catch(err){
      console.log(err);
    }
    return paths;
}

export type FoodIndex = {
    name:string,
    alias?:string,
}

export type FoodGroup = {
    name: string;
    data: Record<string, FoodIndex>;
}

export function getFoodListFromGroup(g:string):FoodGroup{
    let group:FoodGroup ={name:"", data:{}};
  try{
    let pa = `./jsondata/group/${g}.json`;
    if(!fs.existsSync(pa)){
      return {name:"", data:{} };
    }
    group = JSON.parse(fs.readFileSync(pa, undefined).toString());
  }catch(err){
    console.log(err);
  }
  return group;
}

export function getAllFoodList():string[]{
  let paths: string[]=[];
  try{
    paths = fs.readdirSync("./jsondata", undefined);
    paths = paths.filter((value:string) => { return value != 'unit' && value != 'group'; });
  }catch(err){
    console.log(err);
  }
  return paths;
}

export function getFoodTables(f:string):string[]{
    let paths: string[]=[];
    try{
      let pa =`./jsondata/${f}`;
      if(!fs.existsSync(pa)){
        return [];
      }
      paths = fs.readdirSync(pa, undefined);
      paths = paths.map((v)=> path.parse(v).name);
    }catch(err){
      console.log(err);
    }
    return paths;
}

export type FoodValue ={
    raw:string;
    number:number;
    infos?:string[];
}

export type FoodData = Record<string, FoodValue>;

export function getFoodData(id:string, t:string) : FoodData | undefined{
    let data: FoodData = {};
    try{
      let pa = `./jsondata/${id}/${t}.json`;
      if(!fs.existsSync(pa)){
        return undefined;
      }
      data = JSON.parse(fs.readFileSync(pa).toString());
    }catch(e){
        console.log(e);
    }
    return data;
}

export function tableMask(f:string): number{
  switch (f){
    case "nutrients":
        return 0x1;
    case "amino_acid":
        return 0x1 << 1;
    case "fatty_acid":
        return 0x1 << 2;
    case "carbohydrate":
        return 0x1 << 3;
    case "organic_acid":
        return 0x1 << 4;
    case "fiber":
        return 0x1 << 5;
    }
    return 0;
}

export function table2Name(f:string):string | null{
    switch (f){
    case "nutrients":
        return "栄養素";
    case "amino_acid":
        return "アミノ酸";
    case "fatty_acid":
        return "脂肪酸";
    case "carbohydrate":
        return "炭水化物";
    case "organic_acid":
        return "有機酸";
    case "fiber":
        return "食物繊維";
    }
    return null;
}

export function getAllFoodItems(): Record<string, string[]> {
  let items :Record<string, string[]> = {
    "栄養素": Object.entries(getFoodData("unit", "nutrients") as FoodData).map(([k, v]: [string, FoodValue])=>k),
    "アミノ酸":Object.entries(getFoodData("unit", "amino_acid") as FoodData).map(([k, v]: [string, FoodValue])=>k),
    "脂肪酸":Object.entries(getFoodData("unit", "fatty_acid") as FoodData).map(([k, v]: [string, FoodValue])=>k),
    "炭水化物":Object.entries(getFoodData("unit", "carbohydrate") as FoodData).map(([k, v]: [string, FoodValue])=>k),
    "有機酸":Object.entries(getFoodData("unit", "organic_acid") as FoodData).map(([k, v]: [string, FoodValue])=>k),
    "食物繊維":Object.entries(getFoodData("unit", "fiber") as FoodData).map(([k, v]: [string, FoodValue])=>k),
  };

  return items;
}


type FoodTable = {
  id: string,
  data:Record<string, FoodData>,
}[];


export function getFoodTable(group:number, table:number):FoodTable{
  let list : FoodGroup[] = [];
  for (let i = 0; i<18; i++){
    if(group & (1<<i)){
      let g = (i+1).toString().padStart(2, '0');
      list.push(getFoodListFromGroup(g));
    }
  }
  let ret :Record<string, Record<string, FoodData>> = {};
  for(let i in list){
    for(let j in list[i].data){
      ret[j] = {};
    }
    
  } 
  const func = (t:string) => {
    if(table & tableMask(t)){
      for(let i in list){
        for(let j in list[i].data){
          let f =  getFoodData(j, t);
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
  func("organic_acid");
  func("fiber");

  return Object.entries(ret).map(([k,v]:[string, Record<string, FoodData>])=>{
    return {id:k, data:v}
  });
}
