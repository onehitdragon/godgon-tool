import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import translate from "@iamtraction/google-translate";
import { format, traitToString, calcPrice } from "./myutil.js";
import notifier from "node-notifier";

const XMLdata = fs.readFileSync("xml/hat.xml").toString();
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
            const lang = await createHatLang(i, jObjDatas[i].name);
            const hat = createHatObj(
                i,
                lang.langId,
                jObjDatas[i].needLevel,
                jObjDatas[i].trait,
                jObjDatas[i].miniImageID
            );
            const price = calcPrice(hat);
            hat.defense = 0;
            hat.price = Math.floor(price);
            result.push(hat);
        }
        catch(e){}
    }
    fs.writeFileSync("out/hat.json", JSON.stringify(result));
    fs.writeFileSync("out/hatLang.json", JSON.stringify(resultLang));
    fs.writeFileSync("cache/cacheLang.json", JSON.stringify(Array.from(cacheLang.values())));
    console.log(result.length);
    notifier.notify({
        title: 'Run hat complete',
        message: "Run hat complete"
    });
}

async function createHatLang(idx, name){
    if(langExisted.has(name)){
        return langExisted.get(name);
    }

    let lang;
    if(cacheLang.has(name)){
        lang = {
            langId: "hatLang" + idx,
            en: cacheLang.get(name).en,
            vi: cacheLang.get(name).vi
        }
    }
    else{
        const resVi = await translate(name, { to: 'vi', raw: true });
        const resEn = await translate(name, { to: 'en' });
        lang = {
            langId: "hatLang" + idx,
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

function createHatObj(
    idx,
    langId,
    lv,
    trait,
    miniImage
){
    return {
        id: "hat" + idx,
        langId: langId,
        type: "equipment",
        lv: lv,
        equipmentInfo: {
            type: "hat",
            trait: traitToString(trait)
        },
        miniImage: miniImage + ""
    };
}