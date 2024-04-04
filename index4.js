import fs from "fs";

const obj = JSON.parse(fs.readFileSync("out/weapon.json").toString());
let swords = [];
let swordsLevels = new Set();
for(let i = 0; i < obj.length; i++){
    if(obj[i].equipmentInfo.animationId.includes("sw")){
        swordsLevels.add(obj[i].lv);
        swords.push(obj[i]);
    }
}
swordsLevels = Array.from(swordsLevels);
swordsLevels.sort((a, b) => a - b);

const obj2 = JSON.parse(fs.readFileSync("out/glove.json").toString());
let gloves = [];
for(let i = 0; i < obj2.length; i++){
    gloves.push(obj2[i]);
}

const obj3 = JSON.parse(fs.readFileSync("out/jewelry.json").toString());
let jewelries = [];
for(let i = 0; i < obj3.length; i++){
    jewelries.push(obj3[i]);
}

const obj4 = JSON.parse(fs.readFileSync("out/cloth.json").toString());
let clothes = [];
for(let i = 0; i < obj4.length; i++){
    clothes.push(obj4[i]);
}

const obj5 = JSON.parse(fs.readFileSync("out/hat.json").toString());
let hats = [];
for(let i = 0; i < obj5.length; i++){
    hats.push(obj5[i]);
}

function statistic1(){
    swordsLevels.forEach((swordsLevel) => {
        console.log("level " + swordsLevel);
        const swords2 = swords.filter((sw) => sw.lv == swordsLevel);
        let minMinAttack = Number.MAX_VALUE, maxMinAttack = Number.MIN_VALUE;
        let minMaxAttack = Number.MAX_VALUE, maxMaxAttack = Number.MIN_VALUE;
        swords2.forEach((sw) => {
            if(sw.equipmentInfo.minAttack < minMinAttack) minMinAttack = sw.equipmentInfo.minAttack;
            if(sw.equipmentInfo.minAttack > maxMinAttack) maxMinAttack = sw.equipmentInfo.minAttack;
    
            if(sw.equipmentInfo.maxAttack < minMaxAttack) minMaxAttack = sw.equipmentInfo.maxAttack;
            if(sw.equipmentInfo.maxAttack > maxMaxAttack) maxMaxAttack = sw.equipmentInfo.maxAttack;
        });
        console.log("minAttack: " + minMinAttack + ", " + maxMinAttack);
        console.log("maxAttack: " + minMaxAttack + ", " + maxMaxAttack);
        console.log("====================================================");
    });
}

function findEquipment(LEVEL, equipments){
    for(let lv = LEVEL; lv > 0; lv--){
        const eq = equipments.find((eq) => eq.lv == lv && eq.equipmentInfo.trait == "legendary");
        if(eq) return eq;
    }
}

function calcMaxHealth(LEVEL){
    let hpDefault = 300;
    let maxHp = hpDefault;
    maxHp += LEVEL * 100;

    return maxHp;
}

function statistic2(LEVEL){
    console.log("LEVEL: " + LEVEL);
    
    const weapon = findEquipment(LEVEL, swords);
    if(!weapon) return;
    const glove = findEquipment(LEVEL, gloves);
    if(!glove) return;
    const jewelry = findEquipment(LEVEL, jewelries);
    if(!jewelry) return;
    const cloth = findEquipment(LEVEL, clothes);
    if(!cloth) return;
    const hat = findEquipment(LEVEL, hats);
    if(!hat) return;

    let totalDamage = 0;
    totalDamage += weapon.equipmentInfo.maxAttack;
    console.log("weaponLevel: " + weapon.lv);
    console.log("gloveLevel: " + glove.lv);
    console.log("totalDamage: " + totalDamage);
    console.log("crit: " + glove.equipmentInfo.crit + "%");
    console.log("attackSpeed: " + glove.equipmentInfo.attackSpeed + "%");
    const baseAttackSpeed = 50 / 25; // 2 times / 1s
    const attackSpeedTime = 25 - (25 / 2) * (glove.equipmentInfo.attackSpeed / 100);
    const attackSpeedDetail = 50 / attackSpeedTime;
    console.log("attackSpeedTime: " + attackSpeedTime);
    console.log("attackSpeedDetail: " + attackSpeedDetail + " times/s");

    let originHp = calcMaxHealth(LEVEL);
    const totalHp = originHp + originHp * (jewelry.equipmentInfo.hp / 100);
    console.log("");
    console.log("jewelryLevel: " + jewelry.lv);
    console.log("totalHp: " + totalHp);
    console.log("originHp: " + originHp);
    console.log("hp: " + jewelry.equipmentInfo.hp + "%");

    // const totalDefense = cloth.equipmentInfo.defense + hat.equipmentInfo.defense;

    return {
        totalDamage: totalDamage,
        totalHp: totalHp
    };
}

for(let lv = 1; lv <= 80; lv++){
    statistic2(lv);
    console.log("====================================================");
}

export { statistic2 }