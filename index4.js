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