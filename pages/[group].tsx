
import { GetStaticPathsContext, GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { BreadcrumbsHome } from "./index";
import { FoodGroup, FoodGroupServer } from '../utils/data';
import FoodGroupList from '../components/foodgrouplist';
import Header from '../components/header';
import Link from 'next/link';
import { Breadcrumbs } from '@mui/material';
import SearchBar from '../components/searchbar';

type Props = {
    group:FoodGroup
}

export const getStaticPaths : GetStaticPaths = async(context : GetStaticPathsContext) =>{
  let paths= FoodGroupServer.getList();
  let groups = paths.map((value:string) => { return {params:{ group:value}}});
  return {
    paths:groups,
    fallback:false,
  };
}

export const getStaticProps: GetStaticProps<Props> =  async ({params} : GetStaticPropsContext) =>{
  if(params == undefined){
    return {props:{group:{id:"", name:"", data:{}}}};
  }
  let group = FoodGroupServer.fromGroup(params.group as string);
  return {
    props:{group}
  };
}

export const BreadcrumbsGroup = (id: string, name:string) =>{
  return <Link href={`/${id}`}>{name}</Link>
}

const Group: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <SearchBar />
    <Header />
    <h2 className='text-xl font-bold'>{props.group.name}</h2>
    <Breadcrumbs> {[
      BreadcrumbsHome(),
      BreadcrumbsGroup(props.group.id, props.group.name)
      ]} </Breadcrumbs>
    <FoodGroupList foodGroup={props.group} />
  </div>;
}

export default Group;