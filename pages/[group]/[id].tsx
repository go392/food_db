import { InferGetStaticPropsType, GetStaticPropsContext, NextPage } from 'next'
import Link from "next/link";
import { FoodTable,  FoodData, FoodGroup } from "../../utils/data";
import { table_name } from "../../data/table";
import { BreadcrumbsGroup } from '../[group]';
import BreadcrumbsList, { BreadcrumbsElement } from '../../components/breadcrumbslist';

type Props = InferGetStaticPropsType<typeof getStaticProps>;
type LinkInfo={
  name:string,
  href:string,
}


export const getStaticPaths = async () => { 
  let paths: string[]=FoodTable.getAllList();
  let  ids = paths.map((value:string) => { return {params:{group:value.substring(0,2), id:value.substring(2)}}});
  return { 
    paths:ids, 
    fallback:false,
  }
}

export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  if(params == undefined){
    return {props: {links:[], id:"", name:"", groupname:""}};
  }
  const info = FoodGroup.fromGroup(params.group as string);
  const groupname =info.name;
  const id = `${params.group}${params.id}`;
  const name = info.data[id].name;
  let paths = FoodTable.getList(id);
  let links:LinkInfo[] = [];
  paths.forEach((p:string) =>{
    let href = `/${params.group}/${params.id}/${p}`;
    let name= table_name[p as keyof typeof table_name] as string;
    links.push({name, href});
  })
  return {
    props: {
      links,
      id,
      name,
      groupname
    }
  }
}

export const BreadcrumbsID= (groupname:string, id:string, foodname:string): BreadcrumbsElement[] =>{
  return [...BreadcrumbsGroup(id.substring(0,2), groupname), {href:`/${id.substring(0,2)}/${id.substring(2)}`, show:foodname}];
}

const Page: NextPage<Props> = (props : Props) => {
  return <div className="max-w-lg m-auto">
    <h1 className='text-2xl font-bold'>{props.name}</h1>
    <BreadcrumbsList list={BreadcrumbsID(props.groupname, props.id, props.name)} />
    {props.links.map((l:LinkInfo)=>
      <Link key={l.href} className="block border border-gray-100 px-2 py-2 w-full" href={l.href}>{l.name}</Link>)}
  </div>;
};

export default Page;