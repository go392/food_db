import { InferGetStaticPropsType, GetStaticPropsContext,NextPage } from 'next'
import { FoodTable, FoodGroup, FoodData } from "../../../utils/data";
import { useState } from 'react';
import BreadcrumbsList, { BreadcrumbsElement } from '../../../components/breadcrumbslist';
import { BreadcrumbsID } from '../[id]';
import { calcAminoAcidScore } from '../../../constants/amino_acid';
import ShowFoodTable from '../../../components/showfoodtable';
import FoodTableList from '../../../components/foodtablelist';
import FoodContentsSetter from '../../../components/foodcontentssetter';
import SearchBar from '../../../components/searchbar';
import { required_nutrients } from '../../../constants/required';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
  const paths = FoodTable.getAllList();
  let ids: any[]=[];
  paths.forEach((v:string) => {
    const tables = FoodTable.getList(v);
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
  }FoodData
  const info =  FoodGroup.fromGroup(params.group as string);
  const groupname =info.name;
  const id = `${params.group}${params.id}`;
  const name = info.data[id].name;
  const data = FoodTable.get(`${params.group}${params.id}`, `${params.slug}`) as FoodTable;
  const unit = FoodTable.get("unit", `${params.slug}`) as FoodTable;
  const amino_acid_score:Record<string, FoodTable>={};
  const tableList = FoodTable.getList(`${params.group}${params.id}`);
  let required = {};
  if(required_nutrients.data[params.slug as string]){
    required = required_nutrients.data[params.slug as string];
  }
  if(params.slug == "amino_acid"){
    let a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "2007")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["?????????????????????"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1985")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["?????????????????????1985"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1973")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["?????????????????????1973"] = a;
    }
    a = calcAminoAcidScore(FoodData.fromFoodTable(data, "amino_acid"), "1957")?.data["amino_acid"];
    if(a != undefined){
      amino_acid_score["????????????????????????"] = a;
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

export const BreadcrumbsTable = (groupname:string, id:string, foodname:string): BreadcrumbsElement[] =>{
  return BreadcrumbsID(groupname, id, foodname);
}

const FoodTablePage: NextPage<Props> = (props: Props) => {
  const [gram, setGram] = useState(100);

  return <div className="max-w-lg m-auto">
    <SearchBar/>
    <h1 className='text-2xl font-bold py-2'>{props.name}</h1>
    <BreadcrumbsList list={BreadcrumbsTable(props.groupname, props.id, props.name)}/>
    <FoodContentsSetter contents={gram} setContents={setGram} />
    <FoodTableList tableList={props.tableList} current={props.table} id={props.id} />
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