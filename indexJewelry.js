import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import translate from "@iamtraction/google-translate";
import { format, traitToString, calcPrice, calcHp } from "./myutil.js";
import notifier from "node-notifier";

const XMLdata = fs.readFileSync("xml/necklace.xml").toString();
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
            const lang = await createJewelryLang(i, jObjDatas[i].name);
            const jewelry = createJewelryObj(
                i,
                lang.langId,
                jObjDatas[i].needLevel,
                jObjDatas[i].trait,
                jObjDatas[i].miniImageID
            );
            const hp = calcHp(jewelry);
            const price = calcPrice(jewelry);
            jewelry.equipmentInfo.hp = Math.floor(hp); //percent
            jewelry.equipmentInfo.mp = 0; //percent
            jewelry.price = Math.floor(price);
            result.push(jewelry);
        }
        catch(e){}
    }
    fs.writeFileSync("out/jewelry.json", JSON.stringify(result));
    fs.writeFileSync("out/jewelryLang.json", JSON.stringify(resultLang));
    fs.writeFileSync("cache/cacheLang.json", JSON.stringify(Array.from(cacheLang.values())));
    console.log(result.length);
}

async function createJewelryLang(idx, name){
    if(langExisted.has(name)){
        return langExisted.get(name);
    }

    let lang;
    if(cacheLang.has(name)){
        lang = {
            langId: "jewelryLang" + idx,
            en: cacheLang.get(name).en,
            vi: cacheLang.get(name).vi
        }
    }
    else{
        const resVi = await translate(name, { to: 'vi', raw: true });
        const resEn = await translate(name, { to: 'en' });
        lang = {
            langId: "jewelryLang" + idx,
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

function createJewelryObj(
    idx,
    langId,
    lv,
    trait,
    miniImage
){
    return {
        id: "jewelry" + idx,
        langId: langId,
        type: "equipment",
        lv: lv,
        equipmentInfo: {
            type: "jewelry",
            trait: traitToString(trait)
        },
        miniImage: miniImage + ""
    };
}