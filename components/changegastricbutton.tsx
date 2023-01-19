import { Alert, Snackbar } from "@mui/material";
import { useState } from "react"
import { FoodInfo } from "../utils/gastric"


export default function ChangeGastricButton({info, addFood, type}: {info:FoodInfo, addFood:(f:FoodInfo)=>void, type:"add"|"remove"}){
  const [open, setOpen] = useState(false);
  const onClose = ()=> setOpen(false);

  return<>
    <button className='grow-0 w-10 h-10 rounded bg-gray-300 hover:bg-gray-200 block my-auto' 
    onClick={() => {addFood(info); setOpen(true);}}>{type == "add" ? "+" : "-"}</button>
    <Snackbar 
      open={open}
      autoHideDuration={3000}
      onClose={onClose}>
      <Alert onClose={onClose} severity="info" sx={{ width: '100%' }}>
        {type == "add" ?`胃の中に[${info.name}]を${info.contents}g追加しました。`: `胃から[${info.name}]を吐き出しました。`}
      </Alert>
    </Snackbar>

  </> 
}