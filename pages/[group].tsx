
import { GetStaticPathsContext, GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import fs from "fs";
import path from 'path';

type Props = {
    group:any
}

export const getStaticPaths : GetStaticPaths = async(context : GetStaticPathsContext) =>{
  let paths: string[]=[];
  let groups: any[]=[];
  try{
    paths = fs.readdirSync("./jsondata/group", undefined);
    groups = paths.map((value:string) => { return {params:{ group:path.parse(value).name}}});
  }catch(err){
    console.log(err);
  }
  return {
    paths:groups,
    fallback:false,
  };
}

export const getStaticProps: GetStaticProps<Props> =  async ({params} : GetStaticPropsContext) =>{
  if(params == undefined){
    return {props:{group:[]}};
  }
  let paths:any;
  try{
    paths = JSON.parse(fs.readFileSync(`./jsondata/group/${params.group}.json`, undefined).toString());
  }catch(err){
    console.log(err);
  }
  return {
    props:{group:paths.data}
  };
}

const Group: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <h1 className='text-2xl font-bold'>{props.group.name}</h1>
    <div> {
      Object.entries(props.group).map(([key, value]: [string, any]) => 
      <Link className='block border border-gray-100 w-full px-2 py-2' key={key} href={`${key.substring(0,2)}/${key.substring(2)}`}>{value.name}</Link>)
      }</div>
  </div>;
}

export default Group;