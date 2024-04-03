import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import translate from "@iamtraction/google-translate";

const XMLdata = fs.readFileSync("weapon.xml").toString();
const parser = new XMLParser();
let jObj = parser.parse(XMLdata);
const jObjDatas = jObj.include.data;
const result = [];
const langExisted = new Map();
const resultLang = {
    langItemDataNames: []
}

start();

async function start(){
    for(let i = 0; i < jObjDatas.length; i++){
        try{
            const lang = await createWeaponLang(i, jObjDatas[i].name);
            result.push(
                createWeaponObj(
                    i,
                    lang.langId,
                    jObjDatas[i].needLevel,
                    jObjDatas[i].trait,
                    jObjDatas[i].type,
                    jObjDatas[i].minPhysicsAttack,
                    jObjDatas[i].maxPhysicsAttack,
                    jObjDatas[i].miniImageID,
                    jObjDatas[i].price
                )
            );
        }
        catch(e){}
    }
    fs.writeFileSync("out/itemdatas.json", JSON.stringify(result));
    fs.writeFileSync("out/itemdataNames.json", JSON.stringify(resultLang));
}

function createWeaponObj(
    idx,
    langId,
    lv,
    trait, type, minAttack, maxAttack,
    miniImage,
    price
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
            minAttack: minAttack,
            maxAttack: maxAttack,
            animationId: levelAndTypeToAnimationId(lv, type)
        },
        miniImage: miniImage + "",
        price: price
    };
}

async function createWeaponLang(idx, name){
    console.log(name);
    if(langExisted.has(name)){
        return langExisted.get(name);
    }
    const resVi = await translate(name, { to: 'vi' });
    const resEn = await translate(name, { to: 'en' });

    const lang = {
        langId: "lang" + idx,
        en: resEn.text,
        vi: resVi.text
    }
    langExisted.set(name, lang);
    resultLang.langItemDataNames.push(lang);

    return lang;
}

function traitToString(trait){
    switch (trait) {
        case "普通":
            return "common";
        case "优秀":
            return "uncommon";
        case "精良":
            return "rare";
        case "史诗":
            return "epic";
        case "传说":
            return "legendary";
        default:
            throw new Error("dont find trait: " + trait);
    }
}

function typeToClass(type){
    switch (type) {
        case "剑":
            return 0;
        case "弓":
            return 1;
        case "杖":
            return 3;
        case "锤":
            return 2;
        default:
            throw new Error("dont find type: " + type);
    }
}

function levelAndTypeToAnimationId(level, type){
    switch (type) {
        case "剑":
            if(level < 10){
                return "sw0";
            }
            if(level < 20){
                return "sw2";
            }
            if(level < 30){
                return "sw4";
            }
            if(level < 35){
                return "sw1";
            }
            if(level < 40){
                return "sw5";
            }
            if(level < 45){
                return "sw3";
            }
            if(level < 50){
                return "sw9";
            }
            if(level < 55){
                return "sw8";
            }
            if(level < 60){
                return "sw7";
            }
            return "sw6";
        case "弓":
            if(level < 10){
                return "w0";
            }
            if(level < 20){
                return "w3";
            }
            if(level < 30){
                return "w5";
            }
            if(level < 35){
                return "w6";
            }
            if(level < 40){
                return "w9";
            }
            if(level < 45){
                return "w7";
            }
            if(level < 50){
                return "w2";
            }
            if(level < 55){
                return "sw4";
            }
            if(level < 60){
                return "w8";
            }
            return "w1";
        case "杖":
            if(level < 10){
                return "ww0";
            }
            if(level < 20){
                return "ww1";
            }
            if(level < 30){
                return "ww2";
            }
            if(level < 35){
                return "ww3";
            }
            if(level < 40){
                return "ww4";
            }
            if(level < 45){
                return "ww5";
            }
            if(level < 50){
                return "ww6";
            }
            if(level < 55){
                return "ww7";
            }
            if(level < 60){
                return "ww8";
            }
            return "ww9";
        case "锤":
            if(level < 10){
                return "ww0";
            }
            if(level < 20){
                return "ww2";
            }
            if(level < 30){
                return "ww3";
            }
            if(level < 35){
                return "ww10";
            }
            if(level < 40){
                return "ww9";
            }
            if(level < 45){
                return "ww8";
            }
            if(level < 50){
                return "ww7";
            }
            if(level < 55){
                return "ww6";
            }
            if(level < 60){
                return "ww5";
            }
            return "ww4";
        default:
            throw new Error("dont find type: " + type);
    }
}