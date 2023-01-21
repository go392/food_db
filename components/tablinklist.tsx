import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { table_name } from "../data/table";

export type TabInfo = {
  name: string,
  href: string,
  show: string,
}

export default function TabLinkList({tabList, current}: {tabList:TabInfo[], current:string}){
  const router = useRouter();
  return <ToggleButtonGroup 
    color="primary"
    value={current}
    exclusive
  aria-label="Platform"
  >{
    tabList.map((e, i)=>{
      return <ToggleButton onClick={()=>router.push(e.href)} key={i} value={e.name}>{e.show}</ToggleButton>;})
    }
  </ToggleButtonGroup>
}