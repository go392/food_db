let xlsx = require('xlsx');
const fs = require('fs')
let utils = xlsx.utils;

const PRIMARY = "食品番号";
const SUB = "食品名";

function write2JSON(list, filename){
    for (let i of list){
        let primary = i[PRIMARY] ? i[PRIMARY].raw : "unit";
        try {
            fs.mkdirSync(`./jsondata/${primary}/`, {recursive:true});
            fs.writeFileSync(`./jsondata/${primary}/${filename}.json`, JSON.stringify(i).toString(), 'utf8');
        }catch(err){
            console.log(err);
        }
    }
}

function toList(file, rows, units, beginrow, endcol){
    let workbook = xlsx.readFile(file);
    let sheet = workbook.Sheets["表全体"];
    let ref = utils.decode_range(sheet['!ref']);
    ref.s.r = beginrow-2;
    ref.e.c = endcol;
    sheet["!ref"] = utils.encode_range(ref); 

    for (let c=ref.s.c ; c <= ref.e.c ; c++) {
        let adr = utils.encode_cell({c:c,r:ref.s.r});
        sheet[adr] = {t:"s", v:rows[c], w:rows[c]};
        adr = utils.encode_cell({c:c,r:ref.s.r+1});
        sheet[adr] = {t:"s", v:units[c], w:units[c]};
    }

    for (let r=beginrow; r<= ref.e.r; r++){
        for (let c=ref.s.c ; c <= ref.e.c ; c++) {
            let adr = utils.encode_cell({c:c, r:r});
            if(!sheet[adr]) continue;

            sheet[adr].infos = [];
            let value = sheet[adr].w;
            sheet[adr].v = parseFloat(sheet[adr].w)
            
            if(isNaN(sheet[adr].v)){
                if((new RegExp(/\(.+?\)/)).test(value)){ // "(x)"
                    value = value.replace("(", "").replace(")", "");
                    sheet[adr].infos.push("estimate");
                    let removebrac = parseFloat(value);
                    if(removebrac != NaN){
                        sheet[adr].v = removebrac;
                    }
                }
                if(value == "Tr"){
                    sheet[adr].v = 0;
                    sheet[adr].infos.push("trace");
                }
            }
            if(!isNaN(sheet[adr].v) && sheet[adr].w.includes("†")){
                sheet[adr].infos.push("dagger");
            }
        }
    }

    let ret = [];

    for (let r=beginrow-1; r<= ref.e.r; r++){
        let d ={};
        for (let c=ref.s.c ; c <= ref.e.c ; c++) {
            let adr = utils.encode_cell({c:c, r:r});
            if (sheet[adr] && sheet[adr].w != ""){
                d[rows[c]] = {raw:sheet[adr].w};
                if(!isNaN(sheet[adr].v)){
                    d[rows[c]].number = sheet[adr].v;
                }
                if(sheet[adr].length!= 0){
                    d[rows[c]].infos = sheet[adr].infos;
                }
            }
        }
        ret.push(d);
    }
    return ret;
}

function add2List(list, db){
    for(let d of db){
        if(!d["食品群"] || d["食品群"].raw=="") continue;
        if(list[d["食品群"].raw] == undefined){
            list[d["食品群"].raw] = {};
        }
        if(d[PRIMARY] && d[PRIMARY].raw  != ""){
            if(list[d["食品群"].raw][d[PRIMARY].raw] == undefined){
                list[d["食品群"].raw][d[PRIMARY].raw] = {name:d[SUB].raw};
            }
            Object.keys(d).filter(key => key.includes("備考")).forEach((v) =>{
                let remarks = d[v].raw;
                if(remarks.includes("別名：")){
                    let begin = remarks.indexOf("別名：")+ "別名：".length;
                    let end= remarks.indexOf("\n", begin);
                    if(end == -1){
                        end = remarks.length;
                    }
                    let str = remarks.substring(begin , end);
                    if(str.replaceAll(" ", "").replaceAll("\n", "").replaceAll("\r", "") == ""){
                        end = remarks.indexOf("\n", begin+2);
                    }
                    if(end == -1){
                        end = remarks.length;
                    }

                    str = str.replaceAll(" ", "").replaceAll("\n", "").replaceAll("\r", "");
                    list[d["食品群"].raw][d[PRIMARY].raw].alias = str;
                } 
            });
        }
    }
}

let food_list ={};

{
    let rows = [
        "食品群",
        "食品番号",
        "索引番号",
        "食品名",
        "廃棄率",
        "エネルギー kJ",
        "エネルギー kcal",
        "水分",
        "アミノ酸組成によるたんぱく質",
        "たんぱく質",
        "脂肪酸のトリアシルグリセロール当量",
        "コレステロール",
        "脂質",
        "利用可能炭水化物(単糖当量)",
        "*1",
        "利用可能炭水化物(質量系)",
        "差引き法による利用可能炭水化物",
        "*2",
        "食物繊維総量",
        "糖アルコール",
        "炭水化物",
        "有機酸",
        "灰分",
        "ナトリウム",
        "カリウム",
        "カルシウム",
        "マグネシウム",
        "リン",
        "鉄",
        "亜鉛",
        "銅",
        "マンガン",
        "ヨウ素",
        "セレン",
        "クロム",
        "モリブデン",
        "レチノール",
        "α-カロテン",
        "β-カロテン",
        "β-クリプトキサンチン",
        "β-カロテン当量",
        "レチノール活性当量",
        "ビタミンD",
        "α-トコフェロール",
        "β-トコフェロール",
        "γ-トコフェロール",
        "δ-トコフェロール",
        "ビタミンK",
        "ビタミンB1",
        "ビタミンB2",
        "ナイアシン",
        "ナイアシン当量",
        "ビタミンB6",
        "ビタミンB12",
        "葉酸",
        "パントテン酸",
        "ビオチン",
        "ビタミンC",
        "アルコール",
        "食塩相当量",
        "栄養素備考"
    ];

    let units =[
        "",
        "",
        "",
        "",
        "%",
        "kJ",
        "kcal",
        "g",
        "g",
        "g",
        "g",
        "mg",
        "g",
        "g",
        "",
        "g",
        "g",
        "",
        "g",
        "g",
        "g",
        "g",
        "g",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "μg",
        "μg",
        "μg",
        "μg",
        "μg",
        "μg",
        "μg",
        "μg",
        "μg",
        "μg",
        "μg",
        "mg",
        "mg",
        "mg",
        "mg",
        "μg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "μg",
        "μg",
        "mg",
        "μg",
        "mg",
        "g",
        "g",
        "",
    ]

    let list = toList("data/栄養素.xlsx", rows, units, 12, utils.decode_col("BJ"));
    write2JSON(list, "nutrients");
    add2List(food_list, list);
}

{
    let rows = [
        "食品群",
        "食品番号",
        "索引番号",
        "食品名",
        "水分",
        "アミノ酸組成によるたんぱく質",
        "たんぱく質",
        "イソロイシン",
        "ロイシン",
        "リシン(リジン)",
        "含硫アミノ酸 メチオニン",
        "含硫アミノ酸 シスチン",
        "含硫アミノ酸 合計",
        "芳香族アミノ酸 フェニルアラニン",
        "芳香族アミノ酸 チロシン",
        "芳香族アミノ酸 合計",
        "トレオニン(スレオニン)",
        "トリプトファン",
        "バリン",
        "ヒスチジン",
        "アルギニン",
        "アラニン",
        "アスパラギン酸",
        "グルタミン酸",
        "グリシン",
        "プロリン",
        "セリン",
        "ヒドロキシプロリン",
        "アミノ酸組成計",
        "アンモニア",
        "剰余アンモニア",
        "アミノ酸備考"
    ];

    let units =[
        "",
        "",
        "",
        "",
        "g",
        "g",
        "g",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "",
    ]
    let list = toList("data/アミノ酸.xlsx", rows, units, 7, utils.decode_col("AF"));
    write2JSON(list, "amino_acid");
    add2List(food_list, list);
}

{
    let rows = [
        "食品群",
        "食品番号",
        "索引番号",
        "食品名",
        "水分",
        "トリアシルグリセロール当量",
        "脂質",
        "脂肪酸総量",
        "飽和脂肪酸",
        "一価不飽和脂肪酸",
        "多価不飽和脂肪酸",
        "n-3系多価不飽和脂肪酸",
        "n-6系多価不飽和脂肪酸",
        "4:0 酪酸",
        "6:0 ヘキサン酸",
        "7:0 ヘプタン酸",
        "8:0 オクタン酸",
        "10:0 デカン酸",
        "12:0 ラウリン酸",
        "13:0 トリデカン酸",
        "14:0 ミリスチン酸",
        "15:0 ペンタデカン酸",
        "15:0 ant ペンタデカン酸",
        "16:0 パルミチン酸",
        "16:0 iso パルミチン酸",
        "17:0 ヘプタデカン酸",
        "17:0 ant ヘプタデカン酸",
        "18:0 ステアリン酸",
        "20:0 アラキジン酸",
        "22:0 ベヘン酸",
        "24:0 リグノセリン酸",
        "10:1 デセン酸",
        "14:1 ミリストレイン酸",
        "15:1 ペンタデセン酸",
        "16:1 パルミトレイン酸",
        "17:1 ヘプタデセン酸",
        "18:1 計",
        "18:1 n-9 オレイン酸",
        "18:1 n-7 シスーバクセン酸",
        "20:1 イコセン酸",
        "22:1 ドコセン酸",
        "24:1 テトラコセン酸",
        "16:2 ヘキサデカジエン酸",
        "16:3 ヘキサデカトリエン酸",
        "16:4 ヘキサデカテトラエン酸",
        "18:2 n-6 リノール酸",
        "18:3 n-3 α-リノレン酸",
        "18:3 n-6 γ-リノレン酸",
        "18:4 n-3 オクタデカテトラエン酸",
        "20:2 n-6 イコサジエン酸",
        "20:3 n-3 イコサトリエン酸",
        "20:3 n-6 イコサトリエン酸",
        "20:4 n-3 イコサテトラエン酸",
        "20:4 n-6 アラキドン酸",
        "20:5 n-3 イコサペンタエン酸",
        "21:5 n-3 ヘンイコサペンタエン酸",
        "22:2 ドコサジエン酸",
        "22:5 n-6 ドコサテトラエン酸",
        "22:5 n-3 ドコサペンタエン酸",
        "22:5 n-6 ドコサペンタエン酸",
        "22:6 n-3 ドコサヘキサエン酸",
        "非同定物質",
        "脂肪酸備考"
    ];

    let units =[
        "",
        "",
        "",
        "",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "mg",
        "",
    ]
    let list = toList("data/脂肪酸.xlsx", rows, units, 7, utils.decode_col("BK"));
    write2JSON(list, "fatty_acid");
    add2List(food_list, list);
}

{
    let rows = [
        "食品群",
        "食品番号",
        "索引番号",
        "食品名",
        "水分",
        "単糖当量",
        "でん粉",
        "ぶどう糖",
        "果糖",
        "ガラクトース",
        "しょ糖",
        "胚芽糖",
        "乳糖",
        "トレハロース",
        "利用可能炭水化物計",
        "ソルビトール",
        "マンニトール",
        "炭水化物備考"
    ];

    let units =[
        "",
        "",
        "",
        "",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "",
    ]
    let list = toList("data/炭水化物.xlsx", rows, units, 8, utils.decode_col("R"));
    write2JSON(list, "carbohydrate");
    add2List(food_list, list);
}

{
    let rows = [
        "食品群",
        "食品番号",
        "索引番号",
        "食品名",
        "水分",
        "プロスキー変法 水溶性食物繊維",
        "プロスキー変法 不溶性食物繊維",
        "プロスキー変法 食物繊維総量",
        "AOAC.2011.25法 低分子量水溶性食物繊維",
        "AOAC.2011.25法 高分子量水溶性食物繊維",
        "AOAC.2011.25法 不溶性食物繊維",
        "AOAC.2011.25法 難消化性でん粉",
        "AOAC.2011.25法 食物繊維総量",
        "食物繊維備考"
    ];

    let units =[
        "",
        "",
        "",
        "",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "",
    ]
    let list = toList("data/食物繊維.xlsx", rows, units, 10, utils.decode_col("N"));
    write2JSON(list, "fiber");
    add2List(food_list, list);
}

{
    let rows = [
        "食品群",
        "食品番号",
        "索引番号",
        "食品名",
        "水分",
        "ギ酸",
        "酢酸",
        "グリコール酸",
        "乳酸",
        "グルコン酸",
        "シュウ酸",
        "マロン酸",
        "コハク酸",
        "フマル酸",
        "リンゴ酸",
        "酒石酸",
        "α-ケトグルタル酸",
        "クエン酸",
        "サリチル酸",
        "p-クマル酸",
        "コーヒー酸",
        "フェルラ酸",
        "クロロゲン酸",
        "キナ酸",
        "オロト酸",
        "ピログルタミン酸",
        "プロビオン酸",
        "有機酸計",
        "有機酸備考"
    ];

    let units =[
        "",
        "",
        "",
        "",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "g",
        "mg",
        "mg",
        "mg",
        "mg",
        "g",
        "g",
        "g",
        "g",
        "g",
        ""
    ]
    let list =toList("data/有機酸.xlsx", rows, units, 8, utils.decode_col("AC"));
    write2JSON(list, "organic_acid");
    add2List(food_list, list);
}

try {
    fs.mkdirSync(`./jsondata/group`, {recursive:true})
    for(let i in food_list){
        let obj ={data : food_list[i]};
        switch(i){
        case "01":
            obj.name = "穀類";
            break;
        case "02":
            obj.name = "いも及びでん粉類";
            break;
        case "03":
            obj.name = "砂糖及び甘味類";
            break;
        case "04":
            obj.name = "豆類";
            break;
        case "05":
            obj.name = "種実類";
            break;
        case "06":
            obj.name = "野菜類";
            break; 
        case "07":
            obj.name = "果実類";
            break;
        case "08":
            obj.name = "きのこ類";
            break;
        case "09":
            obj.name = "藻類";
            break;
        case "10":
            obj.name = "魚介類";
            break;
        case "11":
            obj.name = "肉類";
            break;
        case "12":
            obj.name = "鶏卵";
            break; 
        case "13":
            obj.name = "乳類";
            break;
        case "14":
            obj.name = "油脂類";
            break;
        case "15":
            obj.name = "菓子類";
            break;
        case "16":
            obj.name = "し好飲料";
            break;
        case "17":
            obj.name = "調味料及び香辛料";
            break;
        case "18":
            obj.name = "調味及び流通食品類";
            break; 
        }
        fs.writeFileSync(`./jsondata/group/${i}.json`, JSON.stringify(obj).toString(), 'utf8');
    }
}catch(err){
    console.log(err);
}