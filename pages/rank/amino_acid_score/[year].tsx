
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import { BreadcrumbsElement } from '../../../components/breadcrumbslist';
import { calcAminoAcidScore } from '../../../constants/amino_acid';
import FOODDB from '../../../jsondata/fooddb.json'
import { FoodData, FoodTable } from '../../../utils/data';

type Props = {
    data:FoodData[];
    year:string;
}

export const getStaticPaths : GetStaticPaths = async(context : GetStaticPathsContext) =>{
  return {
    paths:[{params:{year:"2007"}}, {params:{year:"1985"}}, {params:{year:"1973"}}, {params:{year:"1957"}}],
    fallback:false,
  };
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  if(!context.params || !context.params.year) {
    return {props: { data:[], year:"" }};
  }
  const table = FoodData.arrayExec(Object.entries(FOODDB).map(([k, v])=> {return {id:k, data:v}}), calcAminoAcidScore, [context.params.year]);
  const sorted = FoodData.sort(table, ["amino_acid", "アミノ酸スコア"], true);
  const data = sorted.slice(0, 100);
  return {props:{
    data,
    year: context.params.year as string,
  }};
}


const Home: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <h1 className='text-2xl font-bold'>アミノ酸スコアの大きい食品({props.year})</h1>
    <table  className="text-sm table-auto border-collapse border w-full">
        <tbody>{
        props.data.map((v, i) => <tr key={i}>
            <th className='border bg-gray-100 px-2 py-2'>{i+1}</th>
            <th className="border bg-gray-100 px-2 py-2"><Link href={`/${v.id.substring(0,2)}/${v.id.substring(2)}`}>{v.data["amino_acid"]["食品名"].raw}</Link></th>
            <td className="border px-2 py-2">{v.data["amino_acid"]["アミノ酸スコア"].raw }</td>
        </tr>)
        } </tbody>
    </table>
  </div>;
}

export default Home;