import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import translate from "@iamtraction/google-translate";
import notifier from "node-notifier";
import { format, traitToString, typeToClass, levelAndTypeToAnimationId, calcMinAttackAndMaxAttack,
    calcPrice } from "./myutil.js";

const XMLdata = fs.readFileSync("xml/weapon.xml").toString();
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
            const lang = await createWeaponLang(i, jObjDatas[i].name);
            const weapon = createWeaponObj(
                i,
                lang.langId,
                jObjDatas[i].needLevel,
                jObjDatas[i].trait,
                jObjDatas[i].type,
                jObjDatas[i].miniImageID
            );
            const attack = calcMinAttackAndMaxAttack(weapon);
            const price = calcPrice(weapon);
            weapon.equipmentInfo.minAttack = Math.floor(attack.min);
            weapon.equipmentInfo.maxAttack = Math.floor(attack.max);
            weapon.equipmentInfo.price = Math.floor(price);
            result.push(weapon);
        }
        catch(e){
            //console.log(e);
        }
    }
    fs.writeFileSync("out/weapon.json", JSON.stringify(result));
    fs.writeFileSync("out/weaponLang.json", JSON.stringify(resultLang));
    fs.writeFileSync("cache/cacheLang.json", JSON.stringify(Array.from(cacheLang.values())));
    console.log(result.length);
}

function createWeaponObj(
    idx,
    langId,
    lv,
    trait, type,
    miniImage
){
    return {
        id: "weapon" + idx,
        langId: langId,
        type: "equipment",
        lv: lv,
        equipmentInfo: {
            type: "weapon",
            trait: traitToString(trait),
            weaponClass: typeToClass(type),
            animationId: levelAndTypeToAnimationId(lv, type)
        },
        miniImage: miniImage + ""
    };
}

async function createWeaponLang(idx, name){
    if(langExisted.has(name)){
        return langExisted.get(name);
    }

    let lang;
    if(cacheLang.has(name)){
        lang = {
            langId: "weaponLang" + idx,
            en: cacheLang.get(name).en,
            vi: cacheLang.get(name).vi
        }
    }
    else{
        const resVi = await translate(name, { to: 'vi', raw: true });
        const resEn = await translate(name, { to: 'en' });
        lang = {
            langId: "weaponLang" + idx,
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