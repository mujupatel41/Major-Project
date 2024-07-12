const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main().then((res)=>{
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
};

// Testing Route

app.get("/", (req, res)=>{
    res.send("Hii I am @mujupatel41");
});

app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
});