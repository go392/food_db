import Link from "next/link";
import { table_name } from "../data/table";


export default function FoodTableList({tableList, current, id}: {tableList:string[], current:string, id:string}){
    return <div className='flex w-full'>{
      tableList.map((e, i)=>{
        const classname = 'text-sm inline-block rounded px-2 py-2 mx-0.5 flex-1 text-center' + (e == current ? " text-white bg-gray-500": " bg-gray-300 hover:bg-gray-200");
        const href = `/${id.substring(0,2)}/${id.substring(2)}/${e}`;
        return <Link key={i} className={classname} href={href}>{table_name[e as keyof typeof table_name]}</Link>;})
      }
    </div>
}