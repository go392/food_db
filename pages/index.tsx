
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import { getFoodTable, getFoodListFromGroup, getGroup, filterFoodTable, FoodTableFunc } from '../utils/data';

type GroupIndex = {
  id:string,
  name:string,
}

type Props = {
    group:GroupIndex[]
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  const group:GroupIndex[] = getGroup().map((v:string):GroupIndex => { return {id:v, name:getFoodListFromGroup(v).name} });
  const a = getFoodTable(0x1, 0x3f);
  const b = FoodTableFunc.extract(a, "nutrients", BigInt(0xff))[0];
  console.log(a[0], b);
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