
import { useRouter } from 'next/router'
import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FoodList, FoodListSearchResponse, Search } from './api/search';
import Link from 'next/link';

type Props = {
  q: string,
  data: FoodList[]
}

export const getServerSideProps: GetServerSideProps<Props> =  async ({query} : GetServerSidePropsContext) =>{
  let q :string= query["q"] as string ?? "";
  let data : FoodList[] = [];
  if(q) {
    let res :FoodListSearchResponse= Search(q);
    if(res.data){
      data = res.data;
    }
  }

  return {props:{
    q,
    data
  }};
}

export default function Home(props: Props) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(props.q);
  const search = () =>{
    router.push({pathname: '/', query:{q:searchText}});
  }

  return <div className='max-w-lg m-auto'>
    <h1 className='text-2xl font-bold'>食品データベース</h1>
    <div className='flex justify-center my-2'>
    <input onChange={(event) => setSearchText(event.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 flex-1 px-2 py-2" type={"search"}/>
    <button onClick={search} className="bg-gray-500 hover:bg-gray-400 text-white rounded flex-2 px-2 py-2">検索</button>
    </div>
    <div>{
      props.data.map((f:FoodList)=><Link className='block border border-gray-100 px-2 py-2' href={f.id}>{f.name}</Link>)
    }</div>
  </div>;
}
