import { FoodTable, FoodValue } from "../utils/calc";

function getValueString(gram:number|undefined, prop:FoodValue, req?:FoodValue, unit?:FoodValue) : string{
    let unitstring = !unit || unit.raw == "" ? "" : " " + unit.raw;
    let reqstr = "";
    if(gram ==100.0){
      if(prop.number != undefined && !isNaN(prop.number) &&req && req.number != undefined && !isNaN(req.number)){
        reqstr = ` (${(prop.number*100/req.number).toFixed(2)} %)`;
      }
      return prop.raw + unitstring + reqstr;
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
    if(req && req.number != undefined && !isNaN(req.number)){
      reqstr = ` (${(prop.number* gram /req.number).toFixed(2)} %)`;
    }
    return (prop.number * gram / 100.0).toFixed(2).toString() + unitstring + reqstr;
  }

export default function ShowFoodTable({foodTable, unit, contents, required}: { foodTable:FoodTable, unit:FoodTable, required?:FoodTable, contents?:number,}) : JSX.Element{
    return <table className="table-auto border-collapse border w-full">
      <tbody>{
        Object.entries(foodTable).map(([key, value]: [string, any], i)=><tr key={i}>
          <th className="border bg-gray-100">{key}</th>
          <td className="border px-2 py-2">{getValueString(contents, value as FoodValue, required? required[key]: undefined, unit[key as keyof typeof unit])}</td>
        </tr>)
      }</tbody>
    </table>
}