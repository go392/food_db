import fs from 'fs';
import path from 'path';
import rows from '../data/rows';
import { table_name } from '../data/table';
import foodGroupList from '../jsondata/search.json'


export type FoodIndex = {
    name:string,
    alias?:string,
}

export type FoodGroup = {
    id:string,
    name: string;
    data: Record<string, FoodIndex>;
}

export namespace FoodGroup{
  export function getList() : string[]{
    return foodGroupList.map((e) => e.id);
  }
  export function fromGroup(g:string):FoodGroup{
    return foodGroupList[parseInt(g)-1] as unknown as FoodGroup;
  }
}

export type FoodValue ={
  raw:string;
  number?:number;
  infos?:string[];
}

export type FoodTable = Record<string, FoodValue>;

export namespace FoodTable{
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
        case "fiber":
          return 0x1 << 4;
      case "organic_acid":
          return 0x1 << 5;
      }
      return 0;
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

export type FoodData = {
  id: string,
  data:Record<string, FoodTable>,
};

export namespace FoodData{
  export function getAll(group:number=0x3ff, table:number=0x3f):FoodData[]{
    let list : FoodGroup[] = [];
    for (let i = 0; i<18; i++){
      if(group & (1<<i)){
        let g = (i+1).toString().padStart(2, '0');
        list.push(FoodGroup.fromGroup(g));
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
            let f =  FoodTable.get(j, t);
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


export namespace FoodValue{
  export function fromNumber(n:number):FoodValue{
    return {raw:n.toString(), number:n};
  }
  export function fromString(s:string):FoodValue{
    return {raw:s};
  }
}

export namespace FoodData{
  export function fromFoodTable(f:FoodTable, s:string, id:string="") : FoodData{
    const ret :FoodData={id, data:{}};
    ret.data[s] = f;
    return ret;
  }

  export function isFoodData(a:any):a is FoodData{
    return typeof a.id == "string" && typeof a.data == "object";
  }
  export function sort(fd:FoodData[], t:[string, string], reverse:boolean =false): FoodData[]{
    return fd.sort((a, b) => {
      let av, bv;
      if(a.data[t[0]] && a.data[t[0]][t[1]]){
        av = a.data[t[0]][t[1]];
      } else {
        av = undefined;
      }
      if(b.data[t[0]] && b.data[t[0]][t[1]]){
        bv = b.data[t[0]][t[1]];
      } else {
        bv = undefined;
      }
      if(av == undefined){
        return bv == undefined ? 0 : -1;
      }
      if(bv == undefined){
        return 1;
      }
      let r = reverse ? 1 : -1;
      if(av.number != undefined){
        return bv.number != undefined ? ((av.number as number) < (bv.number as number) ? 1 : -1)*r : -1;
      }
      if(bv.number != undefined){
        return 1;
      }
      return (av.raw < bv.raw ? 1: -1)*r; 
    })
  }
  export function arrayExec(fd:FoodData[], func: (f:FoodData, ...a:any)=>FoodData|undefined, args:any[]|Record<string, any>):FoodData[]{
    let ret :FoodData[] = [];
    for(let i of fd){
      const a = Array.isArray(args) ? args : args[i.id];
      if(a == undefined) continue;
      let f:any;
      if(Array.isArray(a)){
        f = func(i, ...a);
      } else {
        f = func(i, a);
      }
      if(f != undefined){
        ret.push(f);
      }
    }
    return ret;
  }
  export function toRecord(fd:FoodData[]):Record<string, FoodData>{
    return Object.fromEntries(fd.map((v)=>[v.id, v]));    
  }
  export function merge(fd:FoodData, fd2:FoodData) :FoodData{
    let d:FoodData = {id:fd.id, data:{}};
    for(let i in fd.data){
      d.data[i] = {};
      for(let j in fd.data[i]){
        d.data[i][j] = {...fd.data[i][j]};
      }
    }
    for(let i in fd2.data){
      if(!d.data[i]) d.data[i] = {};
      for(let j in fd2.data[i]){
        d.data[i][j] = {...fd2.data[i][j]};
      }
    }
    return d;
  }
  export function contains(fd:FoodData, t:[string, string|number] | FoodData):FoodData| undefined{
    if(Array.isArray(t)){
      const table = t[0];
      let row = t[1];
      if(!fd.data[table])return undefined;
      const r = rows[(table + "_rows") as keyof typeof rows];
      if(typeof row == "number") {
        row = r[row];
      }
      if(!fd.data[table][row]) return undefined;
      return fd;
    }
    const fd2 = t as FoodData;
    for(let i in fd2.data){
      if(!fd.data[i]) return undefined;
      for(let j in fd2.data[i]){
        if(!fd.data[i][j]){
          return undefined;
        }
      }
    }
    return fd;
  }
  export function extract(fd:FoodData, t:[string, string|number] | FoodData):FoodData| undefined{
    const d:FoodData = {id: fd.id, data: {}};
    if(Array.isArray(t)){
      const table = t[0];
      let row = t[1];
      if(!fd.data[table])return undefined;
      const r = rows[(table + "_rows") as keyof typeof rows];
      if(typeof row == "number") {
        row = r[row];
      }
      if(!fd.data[table][row]) return undefined;
      d.data[table]={};
      d.data[table][row] = {...fd.data[table][row]};
      return d;
    }
    const fd2 = t as FoodData;
    for(let i in fd2.data){
      if(!fd.data[i]) return undefined;
      d.data[i] ={};
      for(let j in fd2.data[i]){
        if(!fd.data[i][j]){
          return undefined;
        }
        d.data[i][j] = fd.data[i][j];
      }
    }
    return d;
  }
  export function total(fd:FoodData, as_row:[string, string], func:(f:FoodValue[], r:[string, string][])=> FoodValue) :FoodData{
    const ret:FoodData = {id:fd.id, data:{}}
    let list: FoodValue[] = [];
    let rows:[string, string][] = [];
    for(let i in fd.data){
      for(let j in fd.data[i]){
        list.push(fd.data[i][j]);
        rows.push([i, j]);
      }
    }
    ret.data[as_row[0]] = {};
    ret.data[as_row[0]][as_row[1]] = func(list, rows);
    return ret;
  }
  export function sum(fd:FoodData, as_row:[string, string]) : FoodData{
    return total(fd, as_row, (f:FoodValue[]):FoodValue=>{
      let v = 0;
      for(let i in f){
        if(f[i].number == undefined){ continue; }
        v += f[i].number as number;
      }
      return FoodValue.fromNumber(v);
    });
  }
  export function average(fd:FoodData, as_row:[string, string]) : FoodData{
    return total(fd, as_row, (f:FoodValue[]):FoodValue=>{
      let v = 0;
      let l = 0;
      for(let i in f){
        if(f[i].number == undefined){ continue; }
        l++;
        v += f[i].number as number;
      }
      return FoodValue.fromNumber(v/l);
    });
  }
  export function maxValue(fd:FoodData, as_row:[string, string]) : FoodData{
    return total(fd, as_row, (f:FoodValue[]):FoodValue=>{
      let v = -Infinity;
      for(let i in f){
        if(f[i].number == undefined){ continue; }
        if(v < (f[i].number as number)){
          v = f[i].number as number;
        }
      }
      return FoodValue.fromNumber(v);
    });
  }
  export function minValue(fd:FoodData, as_row:[string, string]) : FoodData{
    return total(fd, as_row, (f:FoodValue[]):FoodValue=>{
      let v = Infinity;
      for(let i in f){
        if(f[i].number == undefined){ continue; }
        if(v > (f[i].number as number)){
          v = f[i].number as number;
        }
      }
      return FoodValue.fromNumber(v);
    });
  }
  export function maxItem(fd:FoodData, as_row:[string, string]) : FoodData{
    return total(fd, as_row, (f:FoodValue[], r:[string, string][]):FoodValue=>{
      let v = -Infinity;
      let row:string="";
      for(let i in f){
        if(f[i].number == undefined){ continue; }
        if(v < (f[i].number as number)){
          v = f[i].number as number;
          row = r[i][1];
        }
      }
      return FoodValue.fromString(row);
    });
  }
  export function minItem(fd:FoodData, as_row:[string, string]) : FoodData{
    return total(fd, as_row, (f:FoodValue[], r:[string, string][]):FoodValue=>{
      let v = Infinity;
      let row:string="";
      for(let i in f){
        if(f[i].number == undefined){ continue; }
        if(v > (f[i].number as number)){
          v = f[i].number as number;
          row = r[i][1];
        }
      }
      return FoodValue.fromString(row);
    });
  }
  export function trueItems(fd:FoodData, as_row:[string, string]) : FoodData{
    return total(fd, as_row, (f:FoodValue[], r:[string, string][]):FoodValue=>{
      let row:string[] =[];
      for(let i in f){
        if(f[i].raw == "") continue;
        row.push(r[i][1]);
      }
      return FoodValue.fromString(row.join(", "));
    });
  }
  export function calc(fd:FoodData, value:FoodData|number|string, func:(a:FoodValue, b:FoodValue)=>FoodValue):FoodData{
    const d:FoodData = {id: fd.id, data: {}};
    switch(typeof value){
      case "object":
        const fd2 = value as FoodData;
        if(Object.keys(fd2.data).length == 1 && Object.keys(Object.entries(fd2.data)[0][1]).length == 1){
            let num = Object.entries(Object.entries(fd2.data)[0][1])[0][1];
            for(let j in fd.data){
              d.data[j] = {};
              for(let k in fd.data[j]){
                if(fd.data[j][k].number == undefined) continue;
                d.data[j][k]=  func(fd.data[j][k], num);
              }
            }
        } else {
          for(let j in fd.data){
            if(!fd2.data[j]) continue;
            d.data[j] = {};
            for(let k in fd.data[j]){
              if(!fd2.data[j][k]) continue;
              d.data[j][k]=  func(fd.data[j][k], fd2.data[j][k]);
            }
          }
        }
      break;
      default:
        const val:FoodValue ={raw: value.toString()};
        if(typeof value == "number"){
          val.number = value as number;
        }
        for(let j in fd.data){
          d.data[j] = {};
          for(let k in fd.data[j]){
            d.data[j][k] =  func(fd.data[j][k], val);
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
      return FoodValue.fromNumber(ret);
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
  function bool_calc(f:(a:number, b:number)=>boolean) : (a:FoodValue, b:FoodValue)=>FoodValue{
    return (a:FoodValue, b:FoodValue):FoodValue=>{
      let ret = f(a.number as number, b.number as number);
      return FoodValue.fromString(ret ? "*" : "");
    }
  }
  export function gt(fd:FoodData, value:FoodData|number): FoodData{
    return calc(fd, value, bool_calc((a, b)=> a > b));
  }
  export function lt(fd:FoodData, value:FoodData|number): FoodData{
    return calc(fd, value, bool_calc((a, b)=> a < b));
  }
  export function gte(fd:FoodData, value:FoodData|number): FoodData{
    return calc(fd, value, bool_calc((a, b)=> a >= b));
  }
  export function lte(fd:FoodData, value:FoodData|number): FoodData{
    return calc(fd, value, bool_calc((a, b)=> a <= b));
  }
  export function eq(fd:FoodData, value:FoodData|number): FoodData{
    return calc(fd, value, bool_calc((a, b)=> a == b));
  }
  export function be(fd:FoodData, value:FoodData|number): FoodData{
    return calc(fd, value, bool_calc((a, b)=> a != b));
  }
}

