import { FoodData, FoodValue } from "../utils/calc";


export const essential_amino_acid_2007 :FoodData={
    id:"",
    data:{
        amino_acid:{
            "イソロイシン":FoodValue.fromNumber(30),
            "ロイシン":FoodValue.fromNumber(59),
            "リシン(リジン)":FoodValue.fromNumber(45),
            "含硫アミノ酸 合計":FoodValue.fromNumber(22),
            "芳香族アミノ酸 合計":FoodValue.fromNumber(38),
            "トレオニン(スレオニン)":FoodValue.fromNumber(23),
            "トリプトファン":FoodValue.fromNumber(6),
            "バリン":FoodValue.fromNumber(39),
            "ヒスチジン":FoodValue.fromNumber(15),
        }
    }
} 

export const essential_amino_acid_1985 :FoodData={
    id:"",
    data:{
        amino_acid:{
            "イソロイシン":FoodValue.fromNumber(180/6.25),
            "ロイシン":FoodValue.fromNumber(410/6.25),
            "リシン(リジン)":FoodValue.fromNumber(360/6.25),
            "含硫アミノ酸 合計":FoodValue.fromNumber(160/6.25),
            "芳香族アミノ酸 合計":FoodValue.fromNumber(390/6.25),
            "トレオニン(スレオニン)":FoodValue.fromNumber(210/6.25),
            "トリプトファン":FoodValue.fromNumber(70/6.25),
            "バリン":FoodValue.fromNumber(220/6.25),
            "ヒスチジン":FoodValue.fromNumber(120/6.25),
        }
    }
} 

export const essential_amino_acid_1973 :FoodData={
    id:"", 
    data:{
        amino_acid:{
            "イソロイシン":FoodValue.fromNumber(250/6.25),
            "ロイシン":FoodValue.fromNumber(440/6.25),
            "リシン(リジン)":FoodValue.fromNumber(340/6.25),
            "含硫アミノ酸 合計":FoodValue.fromNumber(220/6.25),
            "芳香族アミノ酸 合計":FoodValue.fromNumber(380/6.25),
            "トレオニン(スレオニン)":FoodValue.fromNumber(250/6.25),
            "トリプトファン":FoodValue.fromNumber(60/6.25),
            "バリン":FoodValue.fromNumber(310/6.25),
        }
    }
} 

export const essential_amino_acid_1957 :FoodData={
    id:"",
    data:{
        amino_acid:{
            "イソロイシン":FoodValue.fromNumber(270/6.25),
            "ロイシン":FoodValue.fromNumber(306/6.25),
            "リシン(リジン)":FoodValue.fromNumber(270/6.25),
            "含硫アミノ酸 合計":FoodValue.fromNumber(270/6.25),
            "芳香族アミノ酸 合計":FoodValue.fromNumber(360/6.25),
            "トレオニン(スレオニン)":FoodValue.fromNumber(180/6.25),
            "トリプトファン":FoodValue.fromNumber(90/6.25),
            "バリン":FoodValue.fromNumber(270/6.25),
        }
    }
} 

export function calcAminoAcidScore(fd:FoodData, t: "2007"|"1985"|"1973"|"1957"  = "2007"):FoodData|undefined{
    let eaa: FoodData;
    switch(t){
      case "2007":
        eaa = essential_amino_acid_2007;
        break;
      case "1985":
        eaa = essential_amino_acid_1985;
        break;
      case "1973":
        eaa = essential_amino_acid_1973;
        break;
      case "1957":
        eaa = essential_amino_acid_1957;
        break;
    }
    const f = FoodData.contains(fd, eaa);
    if(!f) return undefined;
    const name = FoodData.extract(fd, ["amino_acid", "食品名"]);
    if(!name) return undefined;
    const protein = FoodData.extract(fd, ["amino_acid", t == "2007" ? "アミノ酸組成によるたんぱく質" : "たんぱく質"]);
    if(!protein) return undefined;
    const amino_acid = FoodData.extract(fd, eaa);
    if(!amino_acid) return undefined;
    const amino_acid_per_protein= FoodData.div(amino_acid, protein);
    const amino_acid_per_essential= FoodData.mul(FoodData.div(amino_acid_per_protein, eaa), 100);
    const is_limiting_amino_acid =FoodData.lt(amino_acid_per_essential, 100);
    const amino_acid_score = FoodData.minValue(amino_acid_per_essential, ["amino_acid", "アミノ酸スコア"]);
    const limiting_amino_acids = FoodData.trueItems(is_limiting_amino_acid, ["amino_acid", "制限アミノ酸"]);
    return FoodData.merge(name, FoodData.merge(amino_acid_score,  limiting_amino_acids));
  }