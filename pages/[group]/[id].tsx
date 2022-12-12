import fs from "fs";
import path from "path";
import { InferGetStaticPropsType, GetStaticPropsContext, NextPage } from 'next'
import Link from "next/link";

type Props = InferGetStaticPropsType<typeof getStaticProps>;
type LinkInfo={
  name:string,
  href:string,
}


export const getStaticPaths = async () => { 
  let paths: string[]=[];
  let ids: object[]=[];
  try{
    paths = fs.readdirSync("./jsondata", undefined);
    paths = paths.filter((value:string) => { return value != 'unit' && value != 'group'; });
    ids = paths.map((value:string) => { return {params:{group:value.substring(0,2), id:value.substring(2)}}});
  }catch(err){
    console.log(err);
  }
  return { 
    paths:ids, 
    fallback:false,
  }
}

export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  if(params == undefined){
    return {props: {links:[]}};
  }
  let paths: string[] =[];
  try{
    paths = fs.readdirSync(`./jsondata/${params.group}${params.id}`, undefined);
  }catch(err){
    console.log(err);
  }
  let links:LinkInfo[] = [];
  paths.forEach((p:string) =>{
    let link: string = path.parse(p).name;
    let href = `/${params.group}/${params.id}/${link}`;
    switch (link){
    case "nutrients":
      links.push({name:"栄養素",  href});
      break;
    case "amino_acid":
      links.push({name:"アミノ酸", href});
      break;
    case "fatty_acid":
      links.push({name:"脂肪酸", href});
      break;
    case "carbohydrate":
      links.push({name:"炭水化物", href});
      break;
    case "organic_acid":
      links.push({name:"有機酸", href});
      break;
    case "fiber":
      links.push({name:"食物繊維",href});
      break;
    }
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