import { InferGetStaticPropsType, GetStaticPropsContext,NextPage } from 'next'
import { FoodValue, getAllFoodList, getFoodData, getFoodTables } from "../../../utils/data";
import { useState } from 'react';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
  let paths = getAllFoodList();
  let ids: any[]=[];
  paths.forEach((v:string) => {
    let tables = getFoodTables(v);
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
    return {props:{data:{}, unit:{}}};
  }
  let data = getFoodData(`${params.group}${params.id}`, `${params.slug}`);
  let unit = getFoodData("unit", `${params.slug}`);
  
  return {
    props: {
      data,
      unit,
    }
  }
}

function getValueString(gram:number, prop:FoodValue, unit?:FoodValue) : string{

  let unitstring = !unit || unit.raw == "" ? "" : " " + unit.raw;
  if(gram == 100.0){
    return prop.raw + unitstring;
  } 
  if(isNaN(prop.number)) {
    return prop.raw + unitstring;
  }
  return (prop.number * gram / 100.0).toString() + unitstring;
}

const Page: NextPage<Props> = (props: Props) => {
  const [gram, setGram] = useState(100);

  return <div className="max-w-lg m-auto">
    <input value={gram} type="number" onChange={(e)=>setGram(parseFloat(e.target.value))} className=" border bg-gray-100 w-full px-2 py-2" />
    <table className="table-auto border-collapse border w-full"> <tbody>{
    Object.entries(props.data).map(([key, value]: [string, any])=>
    <tr key={key}><th className="border bg-gray-100">{key}</th><td className="border px-2 py-2">{getValueString(gram, value as FoodValue, props.unit[key])}</td></tr>)
    }</tbody></table></div>
};

export default Page;