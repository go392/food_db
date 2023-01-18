
import { GetStaticPathsContext, GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import BreadcrumbsList, {BreadcrumbsElement} from '../components/breadcrumbslist';
import { BreadcrumbsHome } from "./index";
import { FoodGroup, FoodGroupServer } from '../utils/data';
import FoodGroupList from '../components/foodgrouplist';
import SearchBar from '../components/searchbar';
import Header from '../components/header';

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

export const BreadcrumbsGroup = (id: string, name:string) : BreadcrumbsElement[] =>{
  return [...BreadcrumbsHome(), {href:`/${id}`, show:name}];
}

const Group: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <Header />
    <h2 className='text-xl font-bold'>{props.group.name}</h2>
    <BreadcrumbsList list={BreadcrumbsGroup(props.group.id, props.group.name)} />
    <FoodGroupList foodGroup={props.group} />
  </div>;
}

export default Group;