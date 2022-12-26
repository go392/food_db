let xlsx = require('xlsx');
const fs = require('fs');
const r = require("./rows.js");
let utils = xlsx.utils;

const PRIMARY = "食品番号";
const SUB = "食品名";

function write2JSON(list, filename){
    for (let i of list){
        let primary = i[PRIMARY].raw != "" ? i[PRIMARY].raw : "unit";
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
            if(!sheet[adr]) {
                continue;
            }
            if(sheet[adr].w == ""){
                sheet[adr].v = NaN;
                continue;
            }

            sheet[adr].infos = [];
            let value = sheet[adr].w;
            sheet[adr].v = parseFloat(sheet[adr].w);
            
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
            if(!isNaN(sheet[adr].v)){
                if(sheet[adr].w.includes("†")){
                    sheet[adr].infos.push("dagger");
                }
                if(rows[c] == "食品群" || rows[c] == "食品番号" || rows[c] == "索引番号"){
                    sheet[adr].v = NaN;
                }
            }
        }
    }

    let ret = [];

    for (let r=beginrow-1; r<= ref.e.r; r++){
        let d ={};
        for (let c=ref.s.c ; c <= ref.e.c ; c++) {
            let adr = utils.encode_cell({c:c, r:r});
            if (sheet[adr] && (r == ref.s.r+1 ||sheet[adr].w != "")){
                d[rows[c]] = {raw:sheet[adr].w};
                if(!isNaN(sheet[adr].v) && sheet[adr].v != ""){
                    d[rows[c]].number = sheet[adr].v;
                }
                if(sheet[adr].infos && sheet[adr].infos.length != 0){
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
    const rows = r.nutrients_rows;
    const units =[
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

    let list = toList("data/栄養素.xlsx", rows, units, 12, utils.decode_col("BI"));
    write2JSON(list, "nutrients");
    add2List(food_list, list);
}

{
    const rows = r.amino_acid_rows;

    const units =[
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
    const rows = r.fatty_acid_rows;
    const units =[
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
    const rows = r.carbohydrate_rows; 
    const units =[
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
    const rows = r.fiber_rows;
    const units =[
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
    const rows = r.organic_acid_rows;
    const units =[
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
        let obj ={data : food_list[i], id:i};
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