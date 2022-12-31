import fs, { existsSync } from 'fs';
import path from 'path';
import rows from '../data/rows';

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
    id:string,
    name: string;
    data: Record<string, FoodIndex>;
}

export function getFoodListFromGroup(g:string):FoodGroup{
    let group:FoodGroup ={id:g, name:"", data:{}};
  try{
    let pa = `./jsondata/group/${g}.json`;
    if(!fs.existsSync(pa)){
      return {id: g, name:"", data:{} };
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

export function getFoodTableList(f:string):string[]{
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
    number?:number;
    infos?:string[];
}

export type FoodTable = Record<string, FoodValue>;

export function getFoodTable(id:string, t:string) : FoodTable | undefined{
    let data: FoodTable = {};
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

export function getAllFoodItems(): Record<string, string[]> {
  let items :Record<string, string[]> = {
    "栄養素": Object.entries(getFoodTable("unit", "nutrients") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
    "アミノ酸":Object.entries(getFoodTable("unit", "amino_acid") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
    "脂肪酸":Object.entries(getFoodTable("unit", "fatty_acid") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
    "炭水化物":Object.entries(getFoodTable("unit", "carbohydrate") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
    "有機酸":Object.entries(getFoodTable("unit", "organic_acid") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
    "食物繊維":Object.entries(getFoodTable("unit", "fiber") as FoodTable).map(([k, v]: [string, FoodValue])=>k),
  };

  return items;
}


type FoodData = {
  id: string,
  data:Record<string, FoodTable>,
};


export function getFoodData(group:number, table:number):FoodData[]{
  let list : FoodGroup[] = [];
  for (let i = 0; i<18; i++){
    if(group & (1<<i)){
      let g = (i+1).toString().padStart(2, '0');
      list.push(getFoodListFromGroup(g));
    }
  }
  let ret :Record<string, Record<string, FoodTable>> = {};
  for(let i in list){
    for(let j in list[i].data){
      ret[j] = {};
    }
    
  } 
  const func = (t:string) => {
    if(table & tableMask(t)){
      for(let i in list){
        for(let j in list[i].data){
          let f =  getFoodTable(j, t);
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

  return Object.entries(ret).map(([k,v]:[string, Record<string, FoodTable>])=>{
    return {id:k, data:v}
  });
}

export namespace FoodDataFunc{
  export function arrayExec(fd:FoodData[], func: (f:FoodData, ...a:any)=>FoodData, args:Array<any>|Record<string, any>):FoodData[]{
    let ret :FoodData[] = [];
    for(let i of fd){
      const a = Array.isArray(args) ? args : args[i.id];
      if(a == undefined) continue;
      if(Array.isArray(a)){
        ret.push(func(i, ...a));
      } else {
        ret.push(func(i, a));
      }
    }
    return ret;
  }
  export function toRecord(fd:FoodData[]):Record<string, FoodData>{
    return Object.fromEntries(fd.map((v)=>[v.id, v]));    
  }
  export function extract(fd:FoodData, table:string, row:number):FoodData{
    let d:FoodData = {id: fd.id, data: {}};
    if(!fd.data[table])return d;
    const r = rows[(table + "_rows") as keyof typeof rows];
    if(!fd.data[table][r[row]]) return d;
    d.data[table]={};
    d.data[table][r[row]] = {...fd.data[table][r[row]]};
    return d;
  }
  export function calc(fd:FoodData, value:FoodData|number|string, func:(a:FoodValue, b:FoodValue)=>FoodValue):FoodData{
    const d:FoodData = {id: fd.id, data: {...fd.data}};
    const val:FoodValue ={raw: value.toString()};
    if(typeof value == "number"){
      val.number = value as number;
    }
    switch(typeof value){
      case "object":
        if(Object.keys(fd.data).length == 1 && Object.keys(Object.entries(fd.data)[0][1]).length == 1){
            let num = Object.entries(Object.entries(fd.data)[0][1])[0][1];
            for(let j in d.data){
              d.data[j] = { ...fd.data[j] };
              for(let k in d.data[j]){
                if(d.data[j][k].number == undefined) continue;
                d.data[j][k]=  func(d.data[j][k], num);
              }
            }
        } else {
          for(let j in fd.data){
            if(!d.data[j]) continue;
            d.data[j] = { ...d.data[j] };
            for(let k in fd.data[j]){
              if(!d.data[j][k]) continue;
              const v =  (value as FoodData);
              if(v.data[j] == undefined) continue;
              if(v.data[j][k] == undefined) continue;
              d.data[j][k]=  func(d.data[j][k], v.data[j][k]);
            }
          }
        }
      break;
      default:
        for(let j in d.data){
          d.data[j] = { ...d.data[j] };
          for(let k in d.data[j]){
            d.data[j][k] =  func(d.data[j][k], val);
          }
        }
      break;
    }
    return d;
  }
  function number_calc(f:(a:number, b:number)=>number) : (a:FoodValue, b:FoodValue)=>FoodValue{
    return (a:FoodValue, b:FoodValue):FoodValue=>{
      let ret = f(a.number as number, b.number as number);
      if(isNaN(ret)) return a;
      return{raw:ret.toString(), number:ret};
    }
  }
  export function add(fd:FoodData, value:FoodData|number) :FoodData{
    return calc(fd, value, number_calc((a, b) => a+b));
  }
  export function sub(fd:FoodData, value:FoodData|number) :FoodData{
    return calc(fd, value, number_calc((a, b) => a-b));
  }
  export function mul(fd:FoodData, value:FoodData|number) :FoodData{
    return calc(fd, value, number_calc((a, b) => a*b));
  }
  export function div(fd:FoodData, value:FoodData|number) :FoodData{
    return calc(fd, value, number_calc((a, b) => a/b));
  }
  export function max(fd:FoodData, value:FoodData|number) :FoodData{
    return calc(fd, value, number_calc((a, b) => Math.max(a, b)));
  }
  export function min(fd:FoodData, value:FoodData|number) :FoodData{
    return calc(fd, value, number_calc((a, b) => Math.min(a, b)));
  }
}

