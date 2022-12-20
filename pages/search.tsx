
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';

type Props = {
  q: string,
}

export const getServerSideProps: GetServerSideProps<Props> =  async ({query} : GetServerSidePropsContext) =>{
  let q :string= query["q"] as string;

  return {props:{
    q,
  }};
}

export default function Search(props: Props) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(props.q);
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    const timeOutId = setTimeout(() => search(), 500);
    return () => clearTimeout(timeOutId);
  }, [searchText]);

  const search = async() =>{
    router.push({pathname: '/search', query:{q:searchText}});
    const  res= await fetch(`/api/search?q=${searchText}`);
    const json = await res.json();
    if(json.data){
      setSearchResult(json.data);
    }
  }


  return <div className='max-w-lg m-auto'>
    <h1 className='text-2xl font-bold'>食品データベース</h1>
    <div className='flex justify-center my-2'>
    <input onChange={(event) => {setSearchText(event.target.value);}} className="bg-gray-50 border border-gray-300 text-gray-900 flex-1 px-2 py-2" type={"search"}/>
    <button onClick={search} className="bg-gray-500 hover:bg-gray-400 text-white rounded flex-2 px-2 py-2">検索</button>
    </div>
    <div>{
      searchResult.map((f:any)=><Link key={f.id} className='block border border-gray-100 px-2 py-2' href={`${f.id.substring(0,2)}/${f.id.substring(2)}`}>{f.name}</Link>)
    }</div>
  </div>;
}
