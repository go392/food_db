import { InferGetStaticPropsType, GetStaticPropsContext,NextPage } from 'next'
import { FoodTable, FoodValue, FoodGroup, FoodData } from "../../../utils/data";
import { useState } from 'react';
import BreadcrumbsList, { BreadcrumbsElement } from '../../../components/breadcrumbslist';
import { BreadcrumbsID } from '../[id]';
import { table_name } from '../../../data/table';
import { calcAminoAcidScore } from '../../../constants/amino_acid';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
  let paths = FoodTable.getAllList();
  let ids: any[]=[];
  paths.forEach((v:string) => {
    let tables = FoodTable.getList(v);
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
    return {props:{data:{}, unit:{}, name:"", id:"", groupname:"", table:""}};
  }
  const info =  FoodGroup.fromGroup(params.group as string);
  const groupname =info.name;
  const id = `${params.group}${params.id}`;
  const name = info.data[id].name;
  const data = FoodTable.get(`${params.group}${params.id}`, `${params.slug}`) as FoodTable;
  const unit = FoodTable.get("unit", `${params.slug}`) as FoodTable;
  let amino_acid_score:FoodTable | null=null;
  if(params.slug == "amino_acid"){
    let a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"))?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score = a;
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
    }
  }
}

function getValueString(gram:number, prop:FoodValue, unit?:FoodValue) : string{

  let unitstring = !unit || unit.raw == "" ? "" : " " + unit.raw;
  if(gram == 100.0){
    return prop.raw + unitstring;
  } 
  if(!prop.number || isNaN(prop.number)) {
    return prop.raw + unitstring;
  }
  return (prop.number * gram / 100.0).toFixed(2).toString() + unitstring;
}

export const BreadcrumbsTable = (groupname:string, id:string, foodname:string, table:string): BreadcrumbsElement[] =>{
  return [ ...BreadcrumbsID(groupname, id, foodname), {href:`/${id.substring(0,2)}/${id.substring(2)}/${table}`, show: table_name[table as keyof typeof table_name]} ];
}

const Page: NextPage<Props> = (props: Props) => {
  const [gram, setGram] = useState(100);

  return <div className="max-w-lg m-auto">
    <h1 className='text-2xl font-bold'>{props.name}</h1>
    <BreadcrumbsList list={BreadcrumbsTable(props.groupname, props.id, props.name, props.table)}/>
    <input value={gram} type="number" onChange={(e)=>setGram(parseFloat(e.target.value))} className=" border bg-gray-100 w-full px-2 py-2" />
    <table className="table-auto border-collapse border w-full">
      <tbody>{
        Object.entries(props.data).map(([key, value]: [string, any])=><tr key={key}>
          <th className="border bg-gray-100">{key}</th>
          <td className="border px-2 py-2">{getValueString(gram, value as FoodValue, props.unit[key as keyof typeof props.unit])}</td>
        </tr>)
      }</tbody>
    </table>
    {props.amino_acid_score ? 
      <>
      <h2 className='text-xl font-bold'>アミノ酸スコア</h2>
      <table className="table-auto border-collapse border w-full">
        <tbody>{
          Object.entries(props.amino_acid_score).map(([key, value]: [string, any])=><tr key={key}>
            <th className="border bg-gray-100">{key}</th>
            <td className="border px-2 py-2">{getValueString(100, value as FoodValue,  props.unit[key as keyof typeof props.unit])}</td>
          </tr>)
        }</tbody>
      </table>
      </> : <></>
    }
</div>
};

export default Page;