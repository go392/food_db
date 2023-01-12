
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import { BreadcrumbsElement } from '../../components/breadcrumbslist';
import FOODDB from '../../jsondata/fooddb.json'
import { FoodData, FoodTable } from '../../utils/data';

type Props = {
    data:FoodData[];
    unit:string;
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  const table = FoodData.arrayExec(Object.entries(FOODDB).map(([k, v])=> {return {id:k, data:v}}), (f) => {
    const name = FoodData.extract(f, ["amino_acid", "食品名"]);
    if(!name) return undefined;
    const p = FoodData.extract(f, ["amino_acid", "アミノ酸組成によるたんぱく質"]);
    if(!p) return undefined;
    return FoodData.merge(name, p);
  }, []);
  const sorted = FoodData.sort(table, ["amino_acid", "アミノ酸組成によるたんぱく質"], true);
  const data = sorted.slice(0, 100);
  const u = FoodTable.get("unit", "amino_acid") as FoodTable;
  const unit = u["アミノ酸組成によるたんぱく質"].raw;
  return {props:{
    data,
    unit
  }};
}


const Home: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <h1 className='text-2xl font-bold'>たんぱく質の多い食品</h1>
    <table  className="text-sm table-auto border-collapse border w-full">
        <tbody>{
        props.data.map((v, i) => <tr key={i}>
            <th className='border bg-gray-100 px-2 py-2'>{i+1}</th>
            <th className="border bg-gray-100 px-2 py-2"><Link href={`/${v.id.substring(0,2)}/${v.id.substring(2)}`}>{v.data["amino_acid"]["食品名"].raw}</Link></th>
            <td className="border px-2 py-2">{v.data["amino_acid"]["アミノ酸組成によるたんぱく質"].raw + " " + props.unit}</td>
        </tr>)
        } </tbody>
    </table>
  </div>;
}

export default Home;