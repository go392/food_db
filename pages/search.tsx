
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useGastric } from '../utils/gastric';
import ChangeGastricButton from '../components/changegastricbutton';
import Header from '../components/header';
import { alpha,  IconButton, Input, styled, TextField, Toolbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type Props = {
  q: string
}

export const getServerSideProps = ({query} : GetServerSidePropsContext) : GetServerSidePropsResult<Props> => {
  if(typeof query["q"] == "string")
    return {props: {q : query["q"] }};

  return {props: {q: ""}};
}

const SearchDiv = styled('div')(({ theme }) => ({
  position: 'relative',
  display:"flex",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  paddingLeft: "0.5em",
  width: '100%',
}));


export default function Search(props: Props) {
  const gastric = useGastric();
  const [searchText, setSearchText] = useState(props.q);
  const [searchResult, setSearchResult] = useState([]);

  const search = async() =>{
    const res = await (await fetch(`/api/search?q=${searchText}`)).json();
    if(res && res.data){
      setSearchResult(res.data);
    } else {
      setSearchResult([]);
    }
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => search(), 500);
    return () => clearTimeout(timeOutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  

  return <div className='max-w-lg m-auto'>
    <Header hideSearchBar={true}/>
    <Toolbar>
    <SearchDiv>
      <Input disableUnderline placeholder="Search..."
        style={{flexGrow:1}}
        inputProps={{ 'aria-label': 'search' }}
        value={searchText} 
        onChange={(event) => {setSearchText(event.target.value);}} />
      <IconButton  component="label" onClick={search}><SearchIcon/></IconButton>
    </SearchDiv>
    </Toolbar>
    {searchResult.length ? <p className='text-xs py-2 text-gray-500'>{searchResult.length}件の検索結果</p> : <></>}
    <div>{
      searchResult.map((f:any)=>
      <div key={f.id} className="flex">
      <Link
        className='block border border-gray-100 px-2 py-2 w-full' 
        href={`${f.id.substring(0,2)}/${f.id.substring(2)}`}>{
          f.name
      }</Link>
      <ChangeGastricButton info={{id:f.id, name:f.name, contents:100}} addFood={gastric.addFood} type="add" />
      </div>)
  }</div>
  </div>;
}
