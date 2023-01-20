
import { Breadcrumbs } from '@mui/material';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import Header from '../components/header';
import SearchBar from '../components/searchbar';
import { FoodGroup, FoodGroupServer } from '../utils/data';

export type RankingInfo = {key:[string, string], name:string, reverse?:boolean};
export const RankingList: Record<string, RankingInfo> ={
  "protein": {key:["amino_acid", "アミノ酸組成によるたんぱく質"], name:"たんぱく質", reverse:true},
  "omega3": {key:["fatty_acid", "n-3系多価不飽和脂肪酸"], name:"オメガ3脂肪酸", reverse:true},
  "omega6": {key:["fatty_acid", "n-6系多価不飽和脂肪酸"], name:"オメガ6脂肪酸", reverse:true},
  "saturated": {key:["fatty_acid", "飽和脂肪酸"], name:"飽和脂肪酸", reverse:true},
  "water_soluble_fiber" : {key:["fiber", "プロスキー変法 水溶性食物繊維"], name:"水溶性食物繊維", reverse:true},
}

type GroupIndex = {
  id:string,
  name:string,
}

type Props = {
    group:GroupIndex[],
    links:Array<[string, string]>
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  const group:GroupIndex[] = FoodGroupServer.getList().map((v:string):GroupIndex => { return {id:v, name:FoodGroupServer.fromGroup(v).name} });

  const links: Array<[string, string]> = Object.entries(RankingList).map(([k, v]) => [k, v.name]);
  links.push(["amino_acid_score","アミノ酸スコア"]);

  return {props:{
    group,
    links
  }};
}

export const BreadcrumbsHome = () =>{
  return <Link href="/">ホーム</Link>
}

const Home: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <SearchBar />
    <Header />
    <Breadcrumbs>{BreadcrumbsHome()}</Breadcrumbs>
    {props.group.map((o) => <Link href={o.id} key={o.name} className='block w-full border border-glay-100 px-2 py-2'>{o.name}</Link>)}
    <h2 className='text-2xl font-bold px-2 py-2'>ランキング</h2>
      {props.links.map(([k, v]) => <Link className="px-2 py-2 inline-block border" href={`/rank/${k}`} key={k}>{v}</Link>)}
    </div>;
}

export default Home;