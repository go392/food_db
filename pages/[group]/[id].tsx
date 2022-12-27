import { InferGetStaticPropsType, GetStaticPropsContext, NextPage } from 'next'
import Link from "next/link";
import { getAllFoodList, getFoodTables } from "../../utils/data";
import { table_name } from "../../data/table";

type Props = InferGetStaticPropsType<typeof getStaticProps>;
type LinkInfo={
  name:string,
  href:string,
}


export const getStaticPaths = async () => { 
  let paths: string[]=getAllFoodList();
  let  ids = paths.map((value:string) => { return {params:{group:value.substring(0,2), id:value.substring(2)}}});
  return { 
    paths:ids, 
    fallback:false,
  }
}

export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  if(params == undefined){
    return {props: {links:[]}};
  }
  let paths = getFoodTables(`${params.group}${params.id}`);
  let links:LinkInfo[] = [];
  paths.forEach((p:string) =>{
    let href = `/${params.group}/${params.id}/${p}`;
    let name= table_name[p as keyof typeof table_name] as string;
    links.push({name, href});
  })

  return {
    props: {
      links
    }
  }
}

const Page: NextPage<Props> = (props : Props) => {
  return <div className="max-w-lg m-auto">{
    props.links.map((l:LinkInfo)=>
      <Link key={l.href} className="block border border-gray-100 px-2 py-2 w-full" href={l.href}>{l.name}</Link>)}
  </div>;
};

export default Page;