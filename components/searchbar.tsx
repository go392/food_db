import { alpha,  IconButton, Input, styled, Toolbar} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  display:"flex",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
}));


export default function SearchBar({}){
    const [searchText, setSearchText] = useState("");
    const router = useRouter();
    const search = () =>{
        router.push(`/search?q=${searchText}`);
    }

    return <Search>
      <Input disableUnderline placeholder="Search..." 
        style={{paddingLeft:"0.5em", flexGrow:"1"}}
        inputProps={{ 'aria-label': 'search' }}
        onChange={(event) => {setSearchText(event.target.value);}} 
        onKeyDown={(event) => { if(document.activeElement == event.target && event.key == "Enter" && searchText) search(); }} 
      />
      <IconButton  component="label" onClick={search}><SearchIcon/></IconButton>
    </Search>
}

function fade(white: any, arg1: number) {
  throw new Error("Function not implemented.");
}
