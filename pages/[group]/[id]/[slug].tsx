import { InferGetStaticPropsType, GetStaticPropsContext,NextPage } from 'next'
import { FoodTable, FoodValue, FoodGroup, FoodData } from "../../../utils/data";
import { useState } from 'react';
import BreadcrumbsList, { BreadcrumbsElement } from '../../../components/breadcrumbslist';
import { BreadcrumbsID } from '../[id]';
import { table_name } from '../../../data/table';
import { calcAminoAcidScore } from '../../../constants/amino_acid';
import Link from 'next/link';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
  const paths = FoodTable.getAllList();
  let ids: any[]=[];
  paths.forEach((v:string) => {
    const tables = FoodTable.getList(v);
    tables.forEach((t:string) => {
      ids.push({params:{group:v.substring(0,2), id:v.substring(2), slug:t}});
    });
  });
  
  return {
    paths:ids,
    fallback:false,
  }
}


export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  if(params == undefined){
    return {props:{data:{}, unit:{}, name:"", id:"", amino_acid_score:{}, groupname:"", table:"", tableList:[]}};
  }
  const info =  FoodGroup.fromGroup(params.group as string);
  const groupname =info.name;
  const id = `${params.group}${params.id}`;
  const name = info.data[id].name;
  const data = FoodTable.get(`${params.group}${params.id}`, `${params.slug}`) as FoodTable;
  const unit = FoodTable.get("unit", `${params.slug}`) as FoodTable;
  const amino_acid_score:Record<string, FoodTable>={};
  const tableList = FoodTable.getList(`${params.group}${params.id}`);
  if(params.slug == "amino_acid"){
    let a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "2007")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["アミノ酸スコア"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1985")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["アミノ酸スコア1985"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1973")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["アミノ酸スコア1973"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1957")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["プロテインスコア"] = a;
    }
  }

  return {
    props: {
      groupname,
      id, 
      name,
      data,
      unit,
      amino_acid_score,
      table:params.slug as string,
      tableList,
    }
  }
}

function getValueString(gram:number|undefined, prop:FoodValue, unit?:FoodValue) : string{
  let unitstring = !unit || unit.raw == "" ? "" : " " + unit.raw;
  if(gram ==100.0){
    return prop.raw + unitstring;
  } 
  else if(gram == undefined){
    if(prop.number == undefined){
      return prop.raw + unitstring;
    } else {
      return prop.number.toFixed(2).toString() + unitstring;
    }
  }
  if(prop.number==undefined || isNaN(prop.number)) {
    return prop.raw + unitstring;
  }
  return (prop.number * gram / 100.0).toFixed(2).toString() + unitstring;
}

export const BreadcrumbsTable = (groupname:string, id:string, foodname:string): BreadcrumbsElement[] =>{
  return BreadcrumbsID(groupname, id, foodname);
}

const FoodTablePage: NextPage<Props> = (props: Props) => {
  const [gram, setGram] = useState(100);

  return <div className="max-w-lg m-auto">
    <h1 className='text-2xl font-bold  py-2'>{props.name}</h1>
    <BreadcrumbsList list={BreadcrumbsTable(props.groupname, props.id, props.name)}/>
    <div className='flex'>
    <input value={gram} type="number" onChange={(e)=>setGram(parseFloat(e.target.value))} className=" border bg-gray-100 flex-1 px-2 py-2 my-2" />
    <div className='flex-0 px-2 py-2'>g</div>
    </div>
    <div className='flex w-full'>
      {props.tableList.map((e, i)=>
      <Link key={i} className={'text-sm inline-block rounded px-2 py-2 mx-0.5 flex-1 text-center' + (e == props.table ? " text-white bg-gray-500": " bg-gray-300 hover:bg-gray-200")} href={`/${props.id.substring(0,2)}/${props.id.substring(2)}/${e}`}>{table_name[e as keyof typeof table_name]}
      </Link>)
      }
    </div>
    <table className="table-auto border-collapse border w-full">
      <tbody>{
        Object.entries(props.data).map(([key, value]: [string, any], i)=><tr key={i}>
          <th className="border bg-gray-100">{key}</th>
          <td className="border px-2 py-2">{getValueString(gram, value as FoodValue, props.unit[key as keyof typeof props.unit])}</td>
        </tr>)
      }</tbody>
    </table>
    {Object.entries(props.amino_acid_score).map(([k, v], i)=>
      <div key={i}>
      <h2 className='text-xl font-bold py-2'>{k}</h2>
      <table className="table-auto border-collapse border w-full">
        <tbody>{
          Object.entries(v).map(([key, value]: [string, any], i2)=><tr key={i2}>
            <th className="border bg-gray-100">{key}</th>
            <td className="border px-2 py-2">{getValueString(undefined, value as FoodValue,  props.unit[key as keyof typeof props.unit])}</td>
          </tr>)
        }</tbody>
      </table>
      </div>) 
    }
</div>
};

export default FoodTablePage;