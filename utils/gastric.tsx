import cookie from 'js-cookie';
import { useState, useEffect } from 'react';

export type FoodInfo = {
    id:string;
    name:string;
    contents:number;
}


export const useGastric = ()=>{
  const [gastric, setGastric] = useState<FoodInfo[]>([]);

  const setGastricWithCookie = (f: FoodInfo[])=>{
    setGastric(f);
    cookie.set('gastric', JSON.stringify(f.filter((v)=>v.contents!= 0)), { expires: 1 });
  }

  const addFood = (addedItem: FoodInfo) => {
      if (gastric.map((item) => item.id).includes(addedItem.id)) {
        const newCart = gastric.map((item) => {
          if (item.id === addedItem.id) {
            let ret = { ...item };
            ret.contents += addedItem.contents;
            return ret;
          }
          return item;
        });
        setGastricWithCookie(newCart);
      } else {
        setGastricWithCookie([...gastric, addedItem]);
      }
  };
  const setFood = (setItem: FoodInfo) =>{
    if (gastric.map((item) => item.id).includes(setItem.id)) {
      const newCart = gastric.map((item) => {
        if (item.id === setItem.id) {
          let ret = { ...item };
          ret.contents = setItem.contents;
          return ret;
        }
        return item;
      });
      setGastricWithCookie(newCart);
    } else {
      setGastricWithCookie([...gastric, setItem]);
    }
  };
  const removeFood = (removedItem: FoodInfo) => {
    if (!gastric.map((item) => item.id).includes(removedItem.id)) return;
    const newGastric = gastric.filter((v)=>v.id != removedItem.id);
    setGastricWithCookie(newGastric);
  };

  useEffect(() => {
    const g = cookie.get('gastric');
    if(g != null){
      setGastric(JSON.parse(g));
    }
  }, []);

  return {
    gastric,
    addFood,
    setFood,
    removeFood,
  }
}