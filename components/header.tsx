import Link from "next/link";
import SearchBar from "./searchbar";
import FoodBankIcon from '@mui/icons-material/FoodBank';
import { Box, Toolbar, Typography } from "@mui/material";

export default function Header({hideSearchBar} : {hideSearchBar?:boolean}){
  return <Toolbar>
      <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}>
        <Link href={"/"}>FoodDB</Link>
      </Typography>
      {hideSearchBar ?  <></> : <SearchBar/>}
      <Box>
        <Link href="/gastric"><FoodBankIcon fontSize="large"/></Link>
      </Box>
  </Toolbar>
}