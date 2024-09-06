const mongoose = require("mongoose");
const Listing = require("../models/listingModel.js");
const initData = require("./data1.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main().then((res)=>{
    console.log("Data Initialize Successfully");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "66daf1a420fd65684df71203"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

// initDB();