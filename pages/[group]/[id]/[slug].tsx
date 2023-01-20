import { InferGetStaticPropsType, GetStaticPropsContext,NextPage } from 'next'
import { FoodGroup, FoodGroupServer, FoodTableServer } from "../../../utils/data";
import { FoodData, FoodTable } from '../../../utils/calc';
import { useState } from 'react';
import { BreadcrumbsID } from '../[id]';
import { calcAminoAcidScore } from '../../../constants/amino_acid';
import ShowFoodTable from '../../../components/showfoodtable';
import FoodContentsSetter from '../../../components/foodcontentssetter';
import { required_nutrients } from '../../../constants/required';
import TabLinkList from '../../../components/tablinklist';
import { table_name } from '../../../data/table';
import Link from 'next/link';
import { useGastric } from '../../../utils/gastric';
import Header from '../../../components/header';
import ChangeGastricButton from '../../../components/changegastricbutton';
import { Breadcrumbs } from '@mui/material';
import { BreadcrumbsHome } from '../..';
import { BreadcrumbsGroup } from '../../[group]';
import SearchBar from '../../../components/searchbar';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
  const paths = FoodTableServer.getAllList();
  let ids: any[]=[];
  paths.forEach((v:string) => {
    const tables = FoodTableServer.getList(v);
    tables.forEach((t:string) => {
      ids.push({params:{group:v.substring(0,2), id:v.substring(2), slug:t}});
    });
  });
  
  return {
    paths:ids,
    fallback:false,
  }
}


export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  if(params == undefined){
    return {props:{data:{}, unit:{}, name:"", id:"", amino_acid_score:{}, required:{}, groupname:"", table:"", tableList:[]}};
  }
  const info =  FoodGroupServer.fromGroup(params.group as string);
  const groupname =info.name;
  const id = `${params.group}${params.id}`;
  const name = info.data[id].name;
  const data = FoodTableServer.get(`${params.group}${params.id}`, `${params.slug}`) as FoodTable;
  const unit = FoodTableServer.get("unit", `${params.slug}`) as FoodTable;
  const amino_acid_score:Record<string, FoodTable>={};
  const tableList = FoodTableServer.getList(`${params.group}${params.id}`);
  let required = {};
  if(required_nutrients.data[params.slug as string]){
    required = required_nutrients.data[params.slug as string];
  }
  if(params.slug == "amino_acid"){
    let a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "2007")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["アミノ酸スコア"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1985")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["アミノ酸スコア1985"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1973")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["アミノ酸スコア1973"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1957")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["プロテインスコア"] = a;
    }
  }

  return {
    props: {
      groupname,
      id, 
      name,
      data,
      unit,
      amino_acid_score,
      required,
      table:params.slug as string,
      tableList,
    }
  }
}

const FoodTablePage: NextPage<Props> = (props: Props) => {
  const gastric = useGastric();
  const [gram, setGram] = useState(100);

  return <div className="max-w-lg m-auto">
    <SearchBar />
    <Header />
    <h2 className='text-xl font-bold py-2'>{props.name}</h2>
    <Breadcrumbs>{[
      BreadcrumbsHome(),
      BreadcrumbsGroup(props.id.substring(0,2), props.groupname),
      BreadcrumbsID(props.id, props.name),
    ]}</Breadcrumbs>
    <div className='flex'>
      <FoodContentsSetter contents={gram} setContents={setGram} />
      <ChangeGastricButton info={{id:props.id, name:props.name, contents:gram}} addFood={gastric.addFood} type="add" />
    </div>
    <TabLinkList 
      tabList={props.tableList.map((v)=>{
        return {
          name:v, 
          href:`/${props.id.substring(0,2)}/${props.id.substring(2)}/${v}`,
          show:table_name[v as keyof typeof table_name],
        }
      })} 
      current={props.table} 
    />
    <ShowFoodTable foodTable={props.data} unit={props.unit} required={props.required} contents={gram} />
    {Object.entries(props.amino_acid_score).map(([k, v], i)=>
      <div key={i}>
      <h2 className='text-xl font-bold py-2'>{k}</h2>
      <ShowFoodTable foodTable={v} unit={props.unit} />
      </div>) 
    }
</div>
};

export default FoodTablePage;