

export default function FoodContentsSetter({contents, setContents}: {contents : number, setContents:(n:number)=>void}):JSX.Element{
    return <div className='flex'>
      <input value={contents} type="number" onChange={(e)=>setContents(parseFloat(e.target.value))} className=" border bg-gray-100 flex-1 px-2 py-2 my-2" />
      <div className='flex-0 px-2 py-2'>g</div>
    </div>
}