let lvExcept = 1;
let basicExp = 100;
let requireExp = basicExp;
let prevRequireExp = 0;
while(999999 >= requireExp){
    console.log("level: " + lvExcept);
    console.log("requireExp: " + requireExp);
    console.log("requireExpDetail: " + (requireExp - prevRequireExp));
    console.log("");
    prevRequireExp = requireExp;

    lvExcept++;
    const nextExp = basicExp * lvExcept * 12;
    requireExp += nextExp;
}