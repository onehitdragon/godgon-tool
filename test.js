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

console.log(startCase("Búa phá trời"))