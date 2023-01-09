import { useRouter } from "next/router";
import { useState } from "react";


export default function SearchBar({}){
    const [searchText, setSearchText] = useState("");
    const router = useRouter();
    const search = () =>{
        router.push(`/search?q=${searchText}`);
    }

    return <div className='flex justify-center my-2'>
        <input onChange={(event) => {setSearchText(event.target.value);}} 
                onKeyDown={(event) => { if(document.activeElement == event.target && event.key == "Enter" && searchText) search(); }}
                className="bg-gray-50 border border-gray-300 text-gray-900 flex-1 px-2 py-2" 
                type={"search"}/>
        <button onClick={search} className="bg-gray-500 hover:bg-gray-400 text-white rounded flex-2 px-2 py-2">検索</button>
    </div>
}