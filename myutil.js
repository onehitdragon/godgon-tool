function format(text){
    return startCase(text);
}

function startCase(text = ""){
    text = text.toLowerCase();
    const ws = text.split(" ");
    text = "";
    for(let i = 0; i < ws.length; i++){
        const fc = ws[i].slice(0, 1);
        ws[i] = fc.toUpperCase() + ws[i].slice(1, ws[i].length);
        text += ws[i];
        if(i < ws.length - 1){
            text += ' ';
        }
    }
    return text;
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

function calcMinAttackAndMaxAttack(weapon){
    const BASE = 10;
    const lv = weapon.lv;
    const DAMAGE_INCREASE_PER_LEVEL = 8;
    const MIN_MAX_RATE = 10;
    const traitBonus = traitToTraitBonus(weapon.equipmentInfo.trait);
    let WeaponDamageResult = BASE + (lv - 1) * DAMAGE_INCREASE_PER_LEVEL;
    WeaponDamageResult += WeaponDamageResult * (traitBonus / 100);

    return {
        min: WeaponDamageResult - (WeaponDamageResult * (MIN_MAX_RATE / 100)),
        max: WeaponDamageResult + (WeaponDamageResult * (MIN_MAX_RATE / 100)),
    }
}

function calcPrice(weapon){
    const BASE = 100;
    const lv = weapon.lv;
    const PRICE_INCREASE_PER_LEVEL = 150;
    const traitBonus = traitToTraitBonusPrice(weapon.equipmentInfo.trait);
    let Price = BASE + (lv - 1) * PRICE_INCREASE_PER_LEVEL;
    Price += Price * (traitBonus / 100);

    return Price;
}

function traitToTraitBonus(trait){
    // common uncommon rare epic legendary
    switch (trait) {
        case "common":
            return 0;
        case "uncommon":
            return 10;
        case "rare":
            return 20;
        case "epic":
            return 30;
        case "legendary":
            return 40;
    }
}

function traitToTraitBonusPrice(trait){
    // common uncommon rare epic legendary
    switch (trait) {
        case "common":
            return 0;
        case "uncommon":
            return 50;
        case "rare":
            return 100;
        case "epic":
            return 150;
        case "legendary":
            return 200;
    }
}

function traitToTraitBonusCrit(trait){
    // common uncommon rare epic legendary
    switch (trait) {
        case "common":
            return 10;
        case "uncommon":
            return 20;
        case "rare":
            return 30;
        case "epic":
            return 40;
        case "legendary":
            return 50;
    }
}

function calcCrit(glove){
    const BASE = 0;
    const lv = glove.lv;
    const CRIT_INCREASE_PER_LEVEL = 0.5;
    const traitBonus = traitToTraitBonusCrit(glove.equipmentInfo.trait);
    let CritResult = BASE + (lv - 1) * CRIT_INCREASE_PER_LEVEL;
    CritResult += CritResult * (traitBonus / 100);

    return CritResult;
}

function calcAttackSpeed(glove){
    const BASE = 0;
    const lv = glove.lv;
    const ATTACK_SPEED_INCREASE_PER_LEVEL = 0.4;
    const traitBonus = traitToTraitBonusCrit(glove.equipmentInfo.trait);
    let AttackSpeedResult = BASE + (lv - 1) * ATTACK_SPEED_INCREASE_PER_LEVEL;
    AttackSpeedResult += AttackSpeedResult * (traitBonus / 100);

    return AttackSpeedResult;
}

function traitToTraitBonusMoveSpeed(trait){
    // common uncommon rare epic legendary
    switch (trait) {
        case "common":
            return 10;
        case "uncommon":
            return 20;
        case "rare":
            return 30;
        case "epic":
            return 40;
        case "legendary":
            return 50;
    }
}

function calcMoveSpeed(shoes){
    const BASE = 0;
    const lv = shoes.lv;
    const MOVE_SPEED_INCREASE_PER_LEVEL = 0.65;
    const traitBonus = traitToTraitBonusMoveSpeed(shoes.equipmentInfo.trait);
    let MoveSpeedResult = BASE + (lv - 1) * MOVE_SPEED_INCREASE_PER_LEVEL;
    MoveSpeedResult += MoveSpeedResult * (traitBonus / 100);

    return MoveSpeedResult;
}

function traitToTraitBonusHp(trait){
    // common uncommon rare epic legendary
    switch (trait) {
        case "common":
            return 10;
        case "uncommon":
            return 20;
        case "rare":
            return 30;
        case "epic":
            return 40;
        case "legendary":
            return 50;
    }
}

function calcHp(jewelry){
    const BASE = 10;
    const lv = jewelry.lv;
    const HP_INCREASE_PER_LEVEL = 0.5;
    const traitBonus = traitToTraitBonusHp(jewelry.equipmentInfo.trait);
    let HpResult = BASE + (lv - 1) * HP_INCREASE_PER_LEVEL;
    HpResult += HpResult * (traitBonus / 100);

    return HpResult;
}

function traitToTraitBonusDefense(trait){
    // common uncommon rare epic legendary
    switch (trait) {
        case "common":
            return 10;
        case "uncommon":
            return 20;
        case "rare":
            return 30;
        case "epic":
            return 40;
        case "legendary":
            return 50;
    }
}

function calcDefense(equip){
    const BASE = 10;
    const lv = equip.lv;
    const DEFENSE_INCREASE_PER_LEVEL = 0.8;
    const traitBonus = traitToTraitBonusDefense(equip.equipmentInfo.trait);
    let DefenseResult = BASE + (lv - 1) * DEFENSE_INCREASE_PER_LEVEL;
    DefenseResult += DefenseResult * (traitBonus / 100);

    return DefenseResult;
}

export { format, traitToString, typeToClass, levelAndTypeToAnimationId, calcMinAttackAndMaxAttack, calcPrice,
    calcCrit, calcAttackSpeed, calcMoveSpeed, calcHp, calcDefense }