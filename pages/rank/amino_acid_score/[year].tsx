
import { GetStaticPaths, GetStaticPathsContext, GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import Link from 'next/link';
import { BreadcrumbsHome } from '../..';
import BreadcrumbsList, { BreadcrumbsElement } from '../../../components/breadcrumbslist';
import Header from '../../../components/header';
import TabLinkList from '../../../components/tablinklist';
import { calcAminoAcidScore } from '../../../constants/amino_acid';
import FOODDB from '../../../jsondata/fooddb.json'
import { FoodData } from '../../../utils/calc';

export type Props = {
    data:FoodData[];
    year:string;
    yearList:string[];
}

const yearList =["2007", "1985", "1973", "1957"];

export const getStaticPaths : GetStaticPaths = async(context : GetStaticPathsContext) =>{
  return {
    paths:yearList.map((v) => { return {params: { year:v }} }),
    fallback:false,
  };
}

export const getStaticProps: GetStaticProps<Props> =  async (context : GetStaticPropsContext) =>{
  if(!context.params || !context.params.year) {
    return {props: { data:[], year:"", yearList }};
  }
  const table = FoodData.arrayExec(Object.entries(FOODDB).map(([k, v])=> {return {id:k, data:v}}), calcAminoAcidScore, [context.params.year]);
  const sorted = FoodData.sort(table, ["amino_acid", "アミノ酸スコア"], true);
  const data = sorted.slice(0, 100);
  return {props:{
    data,
    year: context.params.year as string,
    yearList
  }};
}

export function BreadcrumbsAminoAcidScore(year:string):BreadcrumbsElement[]{
  return [ ...BreadcrumbsHome(), {show:"アミノ酸スコアの大きい食品", href:`/rank/amino_acid_score/${year}`  },  ];
}

const AminoAcidScorePage: NextPage<Props> = (props: Props) => {
  return <div className='max-w-lg m-auto'>
    <Header />
    <h2 className='text-xl font-bold'>アミノ酸スコアの大きい食品({props.year})</h2>
    <BreadcrumbsList list={BreadcrumbsAminoAcidScore(props.year)} />
    <TabLinkList 
      tabList={props.yearList.map((v)=> { return { name:v, href:`/rank/amino_acid_score/${v}`, show:`${v}` } })}
      current={props.year}
    />
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

export default AminoAcidScorePage;