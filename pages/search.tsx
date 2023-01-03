
import { useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { FoodGroup } from '../utils/data';

type Props = {
  data: FoodGroup[]
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  const data = FoodGroup.getList().map((v:string)=>FoodGroup.fromGroup(v));

  return {props:{
    data,
  }};
}

type FoodList = {
  name: string,
  id: string,
}

type FoodListSearchResponse = {
  data?:FoodList[],
  status: string,
  message?: string,
};

function searchData(data: FoodGroup[], query:string) : FoodListSearchResponse{
  if(query == "") return {status:"success", data:[]}

  let search_words:string[];
  search_words = query.split(' ');

  let ret : FoodListSearchResponse = {status:"success"};
  ret.data = [];
  for(let d of data){
    for(let i in d.data){
      let match = true;
      for(let j of search_words){
        if(!d.data[i].name.includes(j) && !(d.data[i].alias && (d.data[i].alias as string).includes(j))){
           match = false;
           break;
        }
      }
      if(match)ret.data.push({name: d.data[i].name as string, id: i});
    }
  }
  return ret;
}

export default function Search(props: Props) {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState<FoodList[]>([]);
  useEffect(() => {
    const timeOutId = setTimeout(() => search(), 500);
    return () => clearTimeout(timeOutId);
  }, [searchText]);

  const search = async() =>{
    const res = searchData(props.data, searchText);
    if(res.data){
      setSearchResult(res.data);
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
