import fs from "fs";
import { statistic2 } from "../index4.js";

const monsters = [
    {
        "id": 207,
        "lv": 5
    },
    {
        "id": 236,
        "lv": 10
    },
    {
        "id": 201,
        "lv": 15
    },
    {
        "id": 225,
        "lv": 20
    },
    {
        "id": 200,
        "lv": 25
    },
    {
        "id": 202,
        "lv": 30
    },
    {
        "id": 210,
        "lv": 35
    },
    {
        "id": 221,
        "lv": 35
    },
    {
        "id": 245,
        "lv": 40
    },
    {
        "id": 209,
        "lv": 45
    },
    {
        "id": 214,
        "lv": 50
    },
    {
        "id": 215,
        "lv": 55,
    },
    {
        "id": 218,
        "lv": 60,
    },
    {
        "id": 274,
        "lv": 60
    },
    {
        "id": 900,
        "lv": 65
    }
]

start();

function start(){
    monsters.forEach((monster) => {
        const hp = calcHp(monster);
        const attack = calcMinAttackAndMaxAttack(monster);
        const money = 99;
        monster.hp = Math.floor(hp);
        monster.minAttack = Math.floor(attack.min);
        monster.maxAttack = Math.floor(attack.max);
        monster.money = money;
    });
    fs.writeFileSync("monsterTool/out/monsters.json", JSON.stringify(monsters));
}

function calcHp(monster){
    const DIFFICULT = 8; // 4s to kill
    const lv = monster.lv;
    const totalDamage = statistic2(lv).totalDamage;
    let Hp = totalDamage * DIFFICULT;

    return Hp;
}

function calcMinAttackAndMaxAttack(monster){
    const DIFFICULT = 0.05;
    const MIN_MAX_RATE = 10;
    const lv = monster.lv;
    const totalHp = statistic2(lv).totalHp;
    let Damage = totalHp * DIFFICULT;

    return {
        min: Damage - (Damage * (MIN_MAX_RATE / 100)),
        max: Damage + (Damage * (MIN_MAX_RATE / 100)),
    }
}