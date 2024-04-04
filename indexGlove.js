import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import translate from "@iamtraction/google-translate";
import { format, traitToString, calcPrice, calcCrit, calcAttackSpeed } from "./myutil.js";
import notifier from "node-notifier";

const XMLdata = fs.readFileSync("xml/glove.xml").toString();
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
            const lang = await createGloveLang(i, jObjDatas[i].name);
            const glove = createGloveObj(
                i,
                lang.langId,
                jObjDatas[i].needLevel,
                jObjDatas[i].trait,
                jObjDatas[i].miniImageID
            );
            const crit = calcCrit(glove);
            const attackSpeed = calcAttackSpeed(glove);
            const price = calcPrice(glove);
            glove.equipmentInfo.crit = Math.floor(crit);
            glove.equipmentInfo.attackSpeed = Math.floor(attackSpeed);
            glove.price = price;
            result.push(glove);
        }
        catch(e){}
    }
    fs.writeFileSync("out/glove.json", JSON.stringify(result));
    fs.writeFileSync("out/gloveLang.json", JSON.stringify(resultLang));
    fs.writeFileSync("cache/cacheLang.json", JSON.stringify(Array.from(cacheLang.values())));
    console.log(result.length);
}

async function createGloveLang(idx, name){
    if(langExisted.has(name)){
        return langExisted.get(name);
    }

    let lang;
    if(cacheLang.has(name)){
        lang = {
            langId: "gloveLang" + idx,
            en: cacheLang.get(name).en,
            vi: cacheLang.get(name).vi
        }
    }
    else{
        const resVi = await translate(name, { to: 'vi', raw: true });
        const resEn = await translate(name, { to: 'en' });
        lang = {
            langId: "gloveLang" + idx,
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

function createGloveObj(
    idx,
    langId,
    lv,
    trait,
    miniImage
){
    return {
        id: "glove" + idx,
        langId: langId,
        type: "equipment",
        lv: lv,
        equipmentInfo: {
            type: "glove",
            trait: traitToString(trait)
        },
        miniImage: miniImage + ""
    };
}