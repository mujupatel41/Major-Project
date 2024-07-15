const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listingModel.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

// app.get("/testing", async (req, res)=>{
//     let data = await Listing({
//         title: "My Home",
//         description: "Peaceful Place",
//         image: "",
//         price: 12999,
//         location: "Jalgaon, Maharashtra",
//         country: "India",
//     });
//     console.log(data);
//     data.save();
//     res.send("Data Collected");
// });

// Index Route

app.get("/listings", async (req, res)=>{
    let allListings = await Listing.find();

    res.render("listings/index.ejs", {listings: allListings});
});

app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
});