
import { GetStaticPathsContext, GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import BreadcrumbsList, {BreadcrumbsElement} from '../components/breadcrumbslist';
import { BreadcrumbsHome } from "./index";
import { FoodGroup } from '../utils/data';
import FoodGroupList from '../components/foodgrouplist';

type Props = {
    group:FoodGroup
}

export const getStaticPaths : GetStaticPaths = async(context : GetStaticPathsContext) =>{
  let paths= FoodGroup.getList();
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
  let group = FoodGroup.fromGroup(params.group as string);
  return {
    props:{group}
  };
}

export const BreadcrumbsGroup = (id: string, name:string) : BreadcrumbsElement[] =>{
  return [...BreadcrumbsHome(), {href:`/${id}`, show:name}];
}

const Group: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <h1 className='text-2xl font-bold'>{props.group.name}</h1>
    <BreadcrumbsList list={BreadcrumbsGroup(props.group.id, props.group.name)} />
    <FoodGroupList foodGroup={props.group} />
  </div>;
}

export default Group;