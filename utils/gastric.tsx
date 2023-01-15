import cookie from 'js-cookie';
import { useState, useEffect } from 'react';

export type FoodInfo = {
    id:string;
    name:string;
    contents:number;
}

export const useGastric = ()=>{
   const currentJson = cookie.get('gastric') || '[]';
    const [gastric, setGastric] = useState<FoodInfo[]>(JSON.parse(currentJson));
    const GastricItemIds = gastric.map((item) => item.id);

    const addFood = (addedItem: FoodInfo) => {
        if (GastricItemIds.includes(addedItem.id)) {
          const newCart = gastric.map((item) => {
            if (item.id === addedItem.id) {
              let ret = { ...item };
              ret.contents += addedItem.contents;
              return ret;
            }
            return item;
          });
          setGastric(newCart);
        } else {
          setGastric([...gastric, addedItem]);
        }
    };
    const setFood = (setItem: FoodInfo) =>{
      if (GastricItemIds.includes(setItem.id)) {
        const newCart = gastric.map((item) => {
          if (item.id === setItem.id) {
            let ret = { ...item };
            ret.contents = setItem.contents;
            return ret;
          }
          return item;
        });
        setGastric(newCart);
      } else {
        setGastric([...gastric, setItem]);
      }
    };
    const removeFood = (removedItem: FoodInfo) => {
      if (!GastricItemIds.includes(removedItem.id)) return;
      const newGastric = gastric.filter((v)=>v.id != removedItem.id);
      setGastric(newGastric);
    };

    useEffect(() => {
      cookie.set('gastric', JSON.stringify(gastric.filter((v)=>v.contents!= 0)), { expires: 1 });
    }, [gastric]);

    return {
      gastric,
      addFood,
      setFood,
      removeFood,
    }
}