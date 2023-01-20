import Link from "next/link";
import SearchBar from "./searchbar";
import FoodBankIcon from '@mui/icons-material/FoodBank';

export default function Header({}){
  return <>
    <div className="flex justify-between">
      <h1 className='text-2xl font-bold px-2 py-2'><Link href={"/"}>食品データベース</Link></h1>
      <Link href="/gastric"><FoodBankIcon /></Link>
    </div>
  </>
}