fetch("http://127.0.0.1:5000/api/v1/database/reinit", {
    method: "POST"
})
.then(() => {
    console.log("success");
})
.catch((e) => {
    console.log(e);
})