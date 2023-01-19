import Link from "next/link";
import { FoodGroup, FoodIndex } from "../utils/data";
import { useGastric } from "../utils/gastric";
import ChangeGastricButton from "./changegastricbutton";


export default function FoodGroupList({foodGroup} : { foodGroup:FoodGroup }){
    const gastric = useGastric();
    return <div> {
      Object.entries(foodGroup.data).map(([key, value]: [string, FoodIndex]) => 
      <div className="flex"  key={key} >
      <Link className='block border border-gray-100 w-full px-2 py-2 w-full' 
        href={`${key.substring(0,2)}/${key.substring(2)}`}>{
        value.name
      }</Link>
      <ChangeGastricButton info={{id:key, name:value.name, contents:100}} addFood={gastric.addFood} type="add" />
      </div>)
    }</div>
}