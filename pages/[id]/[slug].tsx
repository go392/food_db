import fs from "fs";
import { InferGetStaticPropsType, GetStaticPropsContext,NextPage } from 'next'
import path from "path";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = async () => {
  let paths: string[]=[];
  let ids: object[]=[];
  try{
    paths = fs.readdirSync("./jsondata", undefined);
    paths = paths.filter((value:string) => { return value != 'unit' && value != 'group'; });
    paths.forEach((dir:string) => {
        if(!dir) return;
        let files = fs.readdirSync(`./jsondata/${dir}`, undefined);
        files.forEach((file)=>{
          ids.push({params: {id:dir, slug:path.parse(file).name}});
        })
    });
  }catch(err){
    console.log(err); 
  }
  return {
    paths:ids,
    fallback:false,
  }
}


export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  let data: object={};
  let unit: object={};
  try{
    data = JSON.parse(fs.readFileSync(`./jsondata/${params.id}/${params.slug}.json`, undefined).toString());
    unit = JSON.parse(fs.readFileSync(`./jsondata/unit/${params.slug}.json`, undefined).toString());
  }catch(err){
    console.log(err);
  }
  return {
    props: {
      data,
      unit,
    }
  }
}

const Page: NextPage<Props> = (props: Props) => {
  return <div className="max-w-lg m-auto"><table className="table-auto border-collapse border w-full"> <tbody>{
    Object.entries(props.data).map(([key, value])=>
    <tr><th className="border bg-gray-100">{key}</th><td className="border px-2 py-2">{value.raw + (props.unit[key] ? " " + props.unit[key].raw : "") }</td></tr>)
    }</tbody></table></div>
};

export default Page;