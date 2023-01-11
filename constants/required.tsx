import { FoodData, FoodValue } from "../utils/data";


export const required_nutrients :FoodData={
    id:"",
    data:{
        nutrients:{
            "エネルギー kcal":FoodValue.fromNumber(2200),
            "アミノ酸組成によるたんぱく質":FoodValue.fromNumber(81),
            "脂質":FoodValue.fromNumber(62),
            "差引き法による利用可能炭水化物":FoodValue.fromNumber(320),
            "食物繊維総量":FoodValue.fromNumber(19),
            "ナトリウム":FoodValue.fromNumber(2900),
            "カリウム":FoodValue.fromNumber(2800),
            "カルシウム":FoodValue.fromNumber(680),
            "マグネシウム":FoodValue.fromNumber(320),
            "リン":FoodValue.fromNumber(900),
            "鉄":FoodValue.fromNumber(6.8),
            "亜鉛":FoodValue.fromNumber(8.8),
            "銅":FoodValue.fromNumber(0.9),
            "マンガン":FoodValue.fromNumber(3.8),
            "ヨウ素":FoodValue.fromNumber(130),
            "セレン":FoodValue.fromNumber(28),
            "クロム":FoodValue.fromNumber(10),
            "モリブデン":FoodValue.fromNumber(25),
            "レチノール活性当量":FoodValue.fromNumber(770),
            "ビタミンD":FoodValue.fromNumber(5.5),
            "α-トコフェロール":FoodValue.fromNumber(6.3),
            "ビタミンK":FoodValue.fromNumber(150),
            "ビタミンB1":FoodValue.fromNumber(1.2),
            "ビタミンB2":FoodValue.fromNumber(1.4),
            "ナイアシン当量":FoodValue.fromNumber(13),
            "ビタミンB6":FoodValue.fromNumber(1.3),
            "ビタミンB12":FoodValue.fromNumber(2.4),
            "葉酸":FoodValue.fromNumber(240),
            "パントテン酸":FoodValue.fromNumber(4.8),
            "ビオチン":FoodValue.fromNumber(50),
            "ビタミンC":FoodValue.fromNumber(100),
        },
        amino_acid:{
            "アミノ酸組成によるたんぱく質":FoodValue.fromNumber(81),
            //体重60kgとして、推奨量算定係数1.25でかけたもの
            /*
            "イソロイシン":FoodValue.fromNumber(20*60*1.25), 
            "ロイシン":FoodValue.fromNumber(39*60*1.25),
            "リシン(リジン)":FoodValue.fromNumber(30*60*1.25),
            "含硫アミノ酸 合計":FoodValue.fromNumber(15*60*1.25),
            "芳香族アミノ酸 合計":FoodValue.fromNumber(25*60*1.25),
            "トレオニン(スレオニン)":FoodValue.fromNumber(15*60*1.25),
            "トリプトファン":FoodValue.fromNumber(4*60*1.25),
            "バリン":FoodValue.fromNumber(26*60*1.25),
            "ヒスチジン":FoodValue.fromNumber(10*60*1.25),
            */
        },
        fatty_acid:{
            "脂質":FoodValue.fromNumber(62),
            "飽和脂肪酸":FoodValue.fromNumber(16),
            "n-3系多価不飽和脂肪酸":FoodValue.fromNumber(2.0),
            "n-6系多価不飽和脂肪酸":FoodValue.fromNumber(9.0),
        },
        carbohydrate:{
            "利用可能炭水化物計":FoodValue.fromNumber(320),
        },
        fiber:{
            "プロスキー変法 食物繊維総量":FoodValue.fromNumber(19),
            "AOAC.2011.25法 食物繊維総量":FoodValue.fromNumber(19),
        },
    }
} 

