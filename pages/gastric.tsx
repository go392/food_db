import { NextPage } from 'next';
import Link from 'next/link';
import BreadcrumbsList , { BreadcrumbsElement } from '../components/breadcrumbslist';
import SearchBar from '../components/searchbar';
import { useGastric } from '../utils/gastric';

const Gastric: NextPage = () => {
  const gastric = useGastric();

  return <div className='max-w-lg m-auto'>
      <SearchBar />
      <h1 className='text-2xl font-bold px-2 py-2'>胃の中</h1>
      <table className="table-auto border-collapse border w-full">
        <thead>
          <tr>
            <th className='border bg-gray-100 px-2 py-2'>食品名</th>
            <th className='border bg-gray-100 px-2 py-2'>内容量(g)</th>
          </tr>
        </thead>
        <tbody>{ gastric.gastric.map((v, i)=> 
          <tr key={i}>
            <th className='border bg-gray-100'><Link className='block w-full py-2' href={`${v.id.substring(0,2)}/${v.id.substring(2)}`}>{v.name}</Link></th>
            <td className='border px-2 py-2 flex'>
              <input className='w-full py-2 inline-block' type="number" value={v.contents} onChange={(e)=>{ v.contents = parseFloat(e.target.value); gastric.setFood(v);}}></input>
              <button className='w-10 h-10 rounded bg-gray-300 inline-block' onClick={()=>gastric.removeFood(v)}>-</button>
            </td>
          </tr>
        ) 
        }</tbody>
      </table>
    </div>;
}

export default Gastric;