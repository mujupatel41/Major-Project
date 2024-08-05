const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

const Listing = require("./models/listingModel.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const app = express();
const port = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

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

app.get("/listings", wrapAsync(async (req, res)=>{
    let allListings = await Listing.find();

    res.render("listings/index.ejs", {listings: allListings});
}));

// New Route

app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

// Create Route

app.post("/listings", wrapAsync(async (req, res, next) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let newListing = await Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Show Route

app.get("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Edit Route

app.get("/listings/:id/edit", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update Route

app.put("/listings/:id", wrapAsync(async (req, res)=>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete Route

app.delete("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let {status = 500, message = "Something Went Wrong!"} = err;
    // res.status(status).send(message);
    res.status(status).render("listings/error.ejs", {message});
});


app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
});