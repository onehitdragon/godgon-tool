import fs from "fs";

const obj = JSON.parse(fs.readFileSync("itemdatas.json").toString());

const logd = ["sw0", "sw1", "sw2", "sw3", "sw4", "sw5", "sw6", "sw7", "sw8", "sw9"];
const logd2 = ["w0", "w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9"];
const logd3 = ["ww0", "ww1", "ww2", "ww3", "ww4", "ww5", "ww6", "ww7", "ww8", "ww9"];
const logd4 = ["ww0", "ww1", "ww2", "ww3", "ww4", "ww5", "ww6", "ww7", "ww8", "ww9", "ww10"];

const maxs = [];

logd4.forEach((v) => {
    log(v);
});

function log(str){
    //console.log("log: " + str);
    const map = new Map();
    for(let i = 0; i < obj.length; i++){
        if(obj[i].equipmentInfo?.animationId == str && obj[i].equipmentInfo?.weaponClass == 3){
            if(!map.get(obj[i].lv)){
                map.set(obj[i].lv, obj[i].id);
            }
        }
    }

    let min = Number.MAX_VALUE, max = Number.MIN_VALUE;
    map.forEach((v, k) => {
        if(k < min) min = k;
        if(k > max) max = k;
    });
    maxs.push({
        max,
        str
    });
    // console.log(min, max);
    // console.log("");
}
console.log(maxs.sort((a, b) => a.max - b.max));