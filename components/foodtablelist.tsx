import Link from "next/link";
import { table_name } from "../data/table";


export default function FoodTableList({tableList, current, id}: {tableList:string[], current:string, id:string}){
    return <div className='grid grid-cols-3 gap-1 my-1 w-full'>{
      tableList.map((e, i)=>{
        const classname = 'text-sm inline-block rounded py-2 text-center' + (e == current ? " text-white bg-gray-500": " bg-gray-300 hover:bg-gray-200");
        const href = `/${id.substring(0,2)}/${id.substring(2)}/${e}`;
        return <Link key={i} className={classname} href={href}>{table_name[e as keyof typeof table_name]}</Link>;})
      }
    </div>
}