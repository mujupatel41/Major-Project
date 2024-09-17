const mongoose = require("mongoose");
const Listing = require("../models/listingModel.js");
const initData = require("./data2.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";

main().then((res)=>{
    console.log("Data Initialize Successfully");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "66e95a3a0939eb9406a7ca69"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

// initDB();