import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import translate from "@iamtraction/google-translate";
import { format, traitToString, calcPrice, calcMoveSpeed } from "./myutil.js";
import notifier from "node-notifier";

const XMLdata = fs.readFileSync("xml/shoes.xml").toString();
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
            const lang = await createShoesLang(i, jObjDatas[i].name);
            const shoes = createShoesObj(
                i,
                lang.langId,
                jObjDatas[i].needLevel,
                jObjDatas[i].trait,
                jObjDatas[i].miniImageID
            );
            const moveSpeed = calcMoveSpeed(shoes);
            const price = calcPrice(shoes);
            shoes.equipmentInfo.moveSpeed = Math.floor(moveSpeed);
            shoes.price = Math.floor(price);
            result.push(shoes);
        }
        catch(e){}
    }
    fs.writeFileSync("out/shoes.json", JSON.stringify(result));
    fs.writeFileSync("out/shoesLang.json", JSON.stringify(resultLang));
    fs.writeFileSync("cache/cacheLang.json", JSON.stringify(Array.from(cacheLang.values())));
    console.log(result.length);
}

async function createShoesLang(idx, name){
    if(langExisted.has(name)){
        return langExisted.get(name);
    }

    let lang;
    if(cacheLang.has(name)){
        lang = {
            langId: "shoesLang" + idx,
            en: cacheLang.get(name).en,
            vi: cacheLang.get(name).vi
        }
    }
    else{
        const resVi = await translate(name, { to: 'vi', raw: true });
        const resEn = await translate(name, { to: 'en' });
        lang = {
            langId: "shoesLang" + idx,
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

function createShoesObj(
    idx,
    langId,
    lv,
    trait,
    miniImage
){
    return {
        id: "shoes" + idx,
        langId: langId,
        type: "equipment",
        lv: lv,
        equipmentInfo: {
            type: "shoes",
            trait: traitToString(trait)
        },
        miniImage: miniImage + ""
    };
}