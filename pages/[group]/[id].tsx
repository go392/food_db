import { InferGetStaticPropsType, GetStaticPropsContext, NextPage } from 'next'
import { FoodData, FoodTable } from '../../utils/calc';
import { BreadcrumbsGroup } from '../[group]';
import * as FoodTablePage from './[id]/[slug]';
import { FoodTableServer } from '../../utils/data';
import Link from 'next/link';

type Props = InferGetStaticPropsType<typeof getStaticProps>;


export const getStaticPaths = async () => { 
  let paths: string[]=FoodTableServer.getAllList();
  let  ids = paths.map((value:string) => { return {params:{group:value.substring(0,2), id:value.substring(2)}}});
  return { 
    paths:ids, 
    fallback:false,
  }
}

export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  if(params == undefined){
    return FoodTablePage.getStaticProps({ params });
  }
  let table = FoodTableServer.getList(`${params.group}${params.id}`)[0];
  return FoodTablePage.getStaticProps({ params:{ group:params.group, id:params.id, slug:table} });
}

export const BreadcrumbsID= (id:string, foodname:string) =>{
  return <Link href={`/${id.substring(0,2)}/${id.substring(2)}`}>{foodname}</Link>
}

const Page: NextPage<Props> = (props : Props) => {
  return <FoodTablePage.default 
    groupname={props.groupname} 
    id={props.id} 
    name={props.name} 
    data={props.data} 
    unit={props.unit} 
    amino_acid_score={props.amino_acid_score} 
    required={props.required}
    table={props.table}
    tableList={props.tableList}/>;
};

export default Page;