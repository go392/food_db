import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import SearchBar from '../components/searchbar';
import ShowFoodTable from '../components/showfoodtable';
import { table_name } from '../data/table';
import { FoodData, FoodTable } from '../utils/calc';
import { useGastric } from '../utils/gastric';
import { GetDBResponse } from './api/getdb';
import unit from '../jsondata/unit.json'
import { required_nutrients } from '../constants/required'
import Header from '../components/header';
import ChangeGastricButton from '../components/changegastricbutton';

type Props = {
  unit: Record<string, FoodTable>,
  required: Record<string, FoodTable>,
};

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  return {props:{
    unit,
    required:required_nutrients.data
  }};
}


const Gastric: NextPage<Props> = (props: Props) => {
  const gastric =  useGastric();
  const data = useRef<Record<string,FoodData>>({});
  const [calclated, setCalclated] = useState<FoodData>({id:"", data:{}});
  const [currentTable, setCurrentTable] = useState("");

  const fetchData =()=> {
    const list = gastric.gastric.map((v)=> v.id).filter((id)=>!(id in data));
    
    if(list.length == 0) return;
    let res:GetDBResponse;
    fetch(`/api/getdb?list=${list.join(",")}`).then((v)=> v.json().then((v)=> {
      res=v;
      if(res.data){
        let ret = FoodData.toRecord(res.data);
        data.current = {...ret, ...data.current};
      }
    }).finally(()=>{() => {
      const r: FoodData[] = [];
      if(gastric.gastric.length == 0) return;
      for(let i of gastric.gastric){
        const d = data.current[i.id];
        if(!d) return undefined;
        r.push(FoodData.mul(d, i.contents/100));
      }
      let f :FoodData = r[0];
      for(let i=1; i<r.length; i++){
        f = FoodData.add(f, r[i]);
      }
  
      for(let i in f.data){
        const list = [
          "食品群",
          "食品番号",
          "索引番号",
          "食品名",
          "廃棄率",
          "栄養素備考",
          "アミノ酸備考",
          "脂肪酸備考",
          "炭水化物備考",
          "食物繊維備考",
          "有機酸備考",
          "*1",
          "*2",
        ]
        for(let j of list){
          if(j in f.data[i]){
            delete f.data[i][j]
          }
        }
      }
      
      setCalclated(f);
    }}));
  }

  useEffect(fetchData, [gastric.gastric]);

  return <div className='max-w-lg m-auto'>
    <SearchBar />
    <Header />
    <h2 className='text-xl font-bold px-2 py-2'>胃の中</h2>
    <table className="table-auto border-collapse border w-full">
      <thead>
        <tr>
          <th className='border bg-gray-100 px-2 py-2'>食品名</th>
          <th className='border bg-gray-100 px-2 py-2'>内容量(g)</th>
        </tr>
      </thead>
      <tbody>{
        gastric.gastric.map((v, i)=> 
        <tr key={i}>
          <th className='border bg-gray-100'><Link className='block w-full py-2' href={`${v.id.substring(0,2)}/${v.id.substring(2)}`}>{v.name}</Link></th>
          <td className='border px-2 py-2 flex'>
            <input className='w-full py-2 inline-block' type="number" value={v.contents} onChange={(e)=>{ v.contents = parseFloat(e.target.value); gastric.setFood(v);}}></input>
            <ChangeGastricButton info={v} addFood={gastric.removeFood} type="remove" />
          </td>
        </tr> )
      }</tbody>
    </table>
    <div className={`flex flex-wrap gap-1 my-1 w-full`}> {
      Object.entries(calclated.data).map(([k, v], i) => {
        const classname = 'px-2 text-sm inline-block rounded py-2 text-center' + (k == currentTable ? " text-white bg-gray-500": " bg-gray-300 hover:bg-gray-200");
        return <button key={i} className={classname} onClick={()=>{ setCurrentTable(k) }}>{table_name[k as keyof typeof table_name]}</button>;
      })
    }</div>
    {
    calclated.data[currentTable] ?
    <ShowFoodTable foodTable={calclated.data[currentTable]} unit={props.unit[currentTable]} required={props.required[currentTable]}  />
    : <></>
    }
    </div>;
}

export default Gastric;
