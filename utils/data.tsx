import fs from 'fs';
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
    group = JSON.parse(fs.readFileSync(`./jsondata/group/${g}.json`, undefined).toString());
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
      paths = fs.readdirSync(`./jsondata/${f}`, undefined);
      paths = paths.filter((value:string) => { return value != 'unit' && value != 'group'; });
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

export function getFoodData(id:string, t:string) : FoodData{
    let data: FoodData = {};
    try{
        data = JSON.parse(fs.readFileSync(`./jsondata/${id}/${t}.json`).toString());
    }catch(e){
        console.log(e);
    }
    return data;
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