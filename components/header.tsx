import Link from "next/link";
import SearchBar from "./searchbar";
import FoodBankIcon from '@mui/icons-material/FoodBank';
import { Box, Toolbar, Typography } from "@mui/material";

export default function Header({hideSearchBar} : {hideSearchBar?:boolean}){
  return <><div className="flex py-2">
      <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}>
        <Link href={"/"}>FoodDB</Link>
      </Typography>
      <Box>
        <Link href="/gastric"><FoodBankIcon fontSize="large"/></Link>
      </Box>
  </div>
  {hideSearchBar ?  <></> :  <Toolbar><SearchBar/></Toolbar>}
  </>
}