import { Alert, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState } from "react"
import { FoodInfo } from "../utils/gastric"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function ChangeGastricButton({info, addFood, type}: {info:FoodInfo, addFood:(f:FoodInfo)=>void, type:"add"|"remove"}){
  const [open, setOpen] = useState(false);
  const onClose = ()=> setOpen(false);

  return<>
    <IconButton
      onClick={() => {addFood(info); setOpen(true);}}>{type == "add" ? <AddIcon/> : <RemoveIcon/> }</IconButton>
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