import fs from "fs";

const obj = JSON.parse(fs.readFileSync("itemdatas.json").toString());

let count = 0;
for(let i = 0; i < obj.length; i++){
    if(obj[i].id.includes("weapon")){
        count++;
    }
}
console.log(count);