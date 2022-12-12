
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import fs from 'fs';

type Props = {
    group:any[]
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  let data :any[]=[];
  try{
    let list:string[] =  fs.readdirSync(`./jsondata/group`, undefined);
    data = list.map((value:string)=>{
      let d = fs.readFileSync(`./jsondata/group/${value}`, undefined);
      return JSON.parse(d.toString());
    })
  }catch(e){
    console.log(e);
  }
  const group:any[] = data.map((v)=>{return{id:v.id, name:v.name}});

  return {props:{
    group
  }};
}

const Home: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    {props.group.map((o) => <Link href={o.id} key={o.name} className='block w-full border border-glay-100 px-2 py-2'>{o.name}</Link>)}
  </div>;
}

export default Home;