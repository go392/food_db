import { FoodTable, FoodValue } from "../utils/data";

function getValueString(gram:number|undefined, prop:FoodValue, unit?:FoodValue) : string{
    let unitstring = !unit || unit.raw == "" ? "" : " " + unit.raw;
    if(gram ==100.0){
      return prop.raw + unitstring;
    } 
    else if(gram == undefined){
      if(prop.number == undefined){
        return prop.raw + unitstring;
      } else {
        return prop.number.toFixed(2).toString() + unitstring;
      }
    }
    if(prop.number==undefined || isNaN(prop.number)) {
      return prop.raw + unitstring;
    }
    return (prop.number * gram / 100.0).toFixed(2).toString() + unitstring;
  }

export default function ShowFoodTable({foodTable, unit, contents}: { foodTable:FoodTable, unit:FoodTable, contents?:number}) : JSX.Element{
    return <table className="table-auto border-collapse border w-full">
      <tbody>{
        Object.entries(foodTable).map(([key, value]: [string, any], i)=><tr key={i}>
          <th className="border bg-gray-100">{key}</th>
          <td className="border px-2 py-2">{getValueString(contents, value as FoodValue, unit[key as keyof typeof unit])}</td>
        </tr>)
      }</tbody>
    </table>
}