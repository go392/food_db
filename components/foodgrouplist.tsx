import Link from "next/link";
import { FoodGroup } from "../utils/data";


export default function FoodGroupList({foodGroup} : { foodGroup:FoodGroup }){
    return <div> {
        Object.entries(foodGroup.data).map(([key, value]: [string, any]) => 
        <Link className='block border border-gray-100 w-full px-2 py-2' key={key} href={`${key.substring(0,2)}/${key.substring(2)}`}>{value.name}</Link>)
    }</div>
}