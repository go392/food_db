
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import { BreadcrumbsElement } from '../../components/breadcrumbslist';
import FOODDB from '../../jsondata/fooddb.json'
import { FoodData, FoodTable } from '../../utils/data';

type Info = {key:[string, string], name:string, reverse?:boolean};

type Props = {
    data:FoodData[];
    unit:string;
    info:Info,
}

const nutrients: Record<string, Info> ={
    "protein": {key:["amino_acid", "アミノ酸組成によるたんぱく質"], name:"たんぱく質", reverse:true},
    "omega3": {key:["fatty_acid", "n-3系多価不飽和脂肪酸"], name:"オメガ3脂肪酸", reverse:true},
    "omega6": {key:["fatty_acid", "n-6系多価不飽和脂肪酸"], name:"オメガ6脂肪酸", reverse:true},
    "saturated": {key:["fatty_acid", "飽和脂肪酸"], name:"飽和脂肪酸", reverse:true},
    "water_soluble_fiber" : {key:["fiber", "プロスキー変法 水溶性食物繊維"], name:"水溶性食物繊維", reverse:true},
}

export const getStaticPaths: GetStaticPaths = async (context: GetStaticPathsContext) => {
    return {
        paths: Object.keys(nutrients).map((k) => { return { params: { elem:k } } }),
        fallback : false,
    }
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  if(context.params == undefined){
    return { props: { data:[], unit:"", info:{key:["",""], name:""} } };
  }
  const info =nutrients[context.params.elem as string];
  const table = FoodData.arrayExec(Object.entries(FOODDB).map(([k, v])=> {return {id:k, data:v}}), (f) => {
    if(context.params == undefined) return undefined;
    const name = FoodData.extract(f, ["nutrients", "食品名"]);
    if(!name) return undefined;
    const p = FoodData.extract(f, info.key);
    if(!p) return undefined;
    return FoodData.merge(name, p);
  }, []);
  const sorted = FoodData.sort(table, info.key, info.reverse);
  const data = sorted.slice(0, 100);
  const u = FoodTable.get("unit", info.key[0]) as FoodTable;
  const unit = u[info.key[1]].raw;
  return {props:{
    data,
    unit,
    info
  }};
}


const Home: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <h1 className='text-2xl font-bold'>{props.info.name}の{props.info.reverse ? "多い": "少ない"}食品</h1>
    <table  className="text-sm table-auto border-collapse border w-full">
        <tbody>{
        props.data.map((v, i) => <tr key={i}>
            <th className='border bg-gray-100 px-2 py-2'>{i+1}</th>
            <th className="border bg-gray-100 px-2 py-2"><Link href={`/${v.id.substring(0,2)}/${v.id.substring(2)}`}>{v.data["nutrients"]["食品名"].raw}</Link></th>
            <td className="border px-2 py-2">{v.data[props.info.key[0]][props.info.key[1]].raw + " " + props.unit}</td>
        </tr>)
        } </tbody>
    </table>
  </div>;
}

export default Home;