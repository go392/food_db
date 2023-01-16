import Link from "next/link";
import { table_name } from "../data/table";

export type TabInfo = {
  name: string,
  href: string,
  show: string,
}

export default function TabLinkList({tabList, current}: {tabList:TabInfo[], current:string}){
    return <div className={`flex flex-wrap gap-1 my-1 w-full`}>{
      tabList.map((e, i)=>{
        const classname = 'px-2 text-sm inline-block rounded py-2 text-center' + (e.name == current ? " text-white bg-gray-500": " bg-gray-300 hover:bg-gray-200");
        const href = e.href;
        return <Link key={i} className={classname} href={href}>{e.show}</Link>;})
      }
    </div>
}