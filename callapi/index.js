const url1 = "http://127.0.0.1:5000/api/v1/database/reinit";
const url2 = "https://onehitdragon.top/api/v1/database/reinit";

fetch(url2, {
    method: "POST"
})
.then(() => {
    console.log("success");
})
.catch((e) => {
    console.log(e);
})