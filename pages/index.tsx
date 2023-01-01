
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import BreadcrumbsList , { BreadcrumbsElement } from '../components/breadcrumbslist';
import { FoodGroup } from '../utils/data';

type GroupIndex = {
  id:string,
  name:string,
}

type Props = {
    group:GroupIndex[]
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  const group:GroupIndex[] = FoodGroup.getList().map((v:string):GroupIndex => { return {id:v, name:FoodGroup.fromGroup(v).name} });
  return {props:{
    group
  }};
}

export const BreadcrumbsHome = () : BreadcrumbsElement[] =>{
  return [{href:"/", show:"ホーム"}];
}

const Home: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
     <h1 className='text-2xl font-bold'>食品データベース</h1>
    <BreadcrumbsList list={BreadcrumbsHome()} />
    {props.group.map((o) => <Link href={o.id} key={o.name} className='block w-full border border-glay-100 px-2 py-2'>{o.name}</Link>)}
  </div>;
}

export default Home;