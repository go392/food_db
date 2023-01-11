
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FoodGroup } from '../utils/data';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

type Props = {
  q: string
}

export const getServerSideProps = ({query} : GetServerSidePropsContext) : GetServerSidePropsResult<Props> => {
  if(typeof query["q"] == "string")
    return {props: {q : query["q"] }};

  return {props: {q: ""}};
}

export default function Search(props: Props) {
  const [searchText, setSearchText] = useState(props.q);
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    const timeOutId = setTimeout(() => search(), 500);
    return () => clearTimeout(timeOutId);
  }, [searchText]);

  const search = async() =>{
    const res = await (await fetch(`/api/search?q=${searchText}`)).json();
    if(res && res.data){
      setSearchResult(res.data);
    } else {
      setSearchResult([]);
    }
  }

  return <div className='max-w-lg m-auto'>
    <h1 className='text-2xl font-bold'>食品データベース</h1>
    <div className='flex justify-center my-2'>
    <input onChange={(event) => {setSearchText(event.target.value);}} className="bg-gray-50 border border-gray-300 text-gray-900 flex-1 px-2 py-2" type={"search"}/>
    <button onClick={search} className="bg-gray-500 hover:bg-gray-400 text-white rounded flex-2 px-2 py-2">検索</button>
    </div>
    {searchResult.length ? <p className='text-xs py-2 text-gray-500'>{searchResult.length}件の検索結果</p> : <></>}
    <div>{
      searchResult.map((f:any)=><Link key={f.id} className='block border border-gray-100 px-2 py-2' href={`${f.id.substring(0,2)}/${f.id.substring(2)}`}>{f.name}</Link>)
    }</div>
  </div>;
}
