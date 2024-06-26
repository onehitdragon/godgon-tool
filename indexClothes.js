import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import translate from "@iamtraction/google-translate";
import { format, traitToString, calcPrice, calcDefense } from "./myutil.js";
import notifier from "node-notifier";

const XMLdata = fs.readFileSync("xml/clothes.xml").toString();
const parser = new XMLParser();
let jObj = parser.parse(XMLdata);
const jObjDatas = jObj.include.data;
const result = [];
const langExisted = new Map();
const cacheLangArray = JSON.parse(fs.readFileSync("cache/cacheLang.json").toString());
const cacheLang = new Map();
cacheLangArray.forEach((cl) => {
    cacheLang.set(cl.target, cl);
});
const resultLang = {
    langItemDataNames: []
}

start();

async function start(){
    for(let i = 0; i < jObjDatas.length; i++){
        try{
            const lang = await createClothLang(i, jObjDatas[i].name);
            const cloth = createClothObj(
                i,
                lang.langId,
                jObjDatas[i].needLevel,
                jObjDatas[i].trait,
                jObjDatas[i].equipmentImageID,
                jObjDatas[i].miniImageID
            );
            const defense = calcDefense(cloth);
            const price = calcPrice(cloth);
            cloth.equipmentInfo.defense = Math.floor(defense);
            cloth.price = Math.floor(price);
            result.push(cloth);
        }
        catch(e){}
    }
    fs.writeFileSync("out/cloth.json", JSON.stringify(result));
    fs.writeFileSync("out/clothLang.json", JSON.stringify(resultLang));
    fs.writeFileSync("cache/cacheLang.json", JSON.stringify(Array.from(cacheLang.values())));
    console.log(result.length);
}

async function createClothLang(idx, name){
    if(langExisted.has(name)){
        return langExisted.get(name);
    }

    let lang;
    if(cacheLang.has(name)){
        lang = {
            langId: "clothLang" + idx,
            en: cacheLang.get(name).en,
            vi: cacheLang.get(name).vi
        }
    }
    else{
        const resVi = await translate(name, { to: 'vi', raw: true });
        const resEn = await translate(name, { to: 'en' });
        lang = {
            langId: "clothLang" + idx,
            en: format(resEn.text),
            vi: format(resVi.text)
        }
        cacheLang.set(name, {
            target: name,
            en: lang.en,
            vi: lang.vi
        });
    }
    langExisted.set(name, lang);
    resultLang.langItemDataNames.push(lang);

    console.log(name);
    return lang;
}

function createClothObj(
    idx,
    langId,
    lv,
    trait, equipmentImageID,
    miniImage
){
    return {
        id: "cloth" + idx,
        langId: langId,
        type: "equipment",
        lv: lv,
        equipmentInfo: {
            type: "shirt",
            trait: traitToString(trait),
            animationId: equipmentImageIDToanimationId(equipmentImageID)
        },
        miniImage: miniImage + ""
    };
}

function equipmentImageIDToanimationId(equipmentImageID){
    if(equipmentImageID == 1025 || equipmentImageID == 1101){
        return "s1";
    }
    if(equipmentImageID == 1029 || equipmentImageID == 1102){
        return "s2";
    }
    if(equipmentImageID == 2045 || equipmentImageID == 2104){
        return "s3";
    }
    if(equipmentImageID == 2041 || equipmentImageID == 2103){
        return "s4";
    }
    if(equipmentImageID == 2037 || equipmentImageID == 2102){
        return "s5";
    }
    if(equipmentImageID == 2033){
        return "s6";
    }
    if(equipmentImageID == 2029){
        return "s7";
    }
    if(equipmentImageID == 2025){
        return "s8";
    }
    if(equipmentImageID == 2021){
        return "s9";
    }
    if(equipmentImageID == 2017){
        return "s10";
    }
    if(equipmentImageID == 2013){
        return "s11";
    }
    if(equipmentImageID == 2009){
        return "s12";
    }
    if(equipmentImageID == 1037){
        return "s13";
    }
    if(equipmentImageID == 1033){
        return "s14";
    }
    throw new Error("equipmentImageID dont find");
}