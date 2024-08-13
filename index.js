const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

const ListingModel = require("./models/listingModel.js");
const ReviewModel = require("./models/reviewModel.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

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

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};

// Testing Route

app.get("/", (req, res)=>{
    res.send("Hii I am @mujupatel41");
});


// Index Route

app.get("/listings", wrapAsync(async (req, res)=>{
    let allListings = await ListingModel.find();

    res.render("listings/index.ejs", {listings: allListings});
}));

// New Route

app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

// Create Route

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    let newListing = await ListingModel(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Show Route

app.get("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Edit Route

app.get("/listings/:id/edit", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update Route

app.put("/listings/:id", validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete Route

app.delete("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Review Route 

app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) =>{
    let listing = await ListingModel.findById(req.params.id);
    let newReview = new ReviewModel(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing.id}`)
}));

// Error Handling

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let {status = 500, message = "Something Went Wrong!"} = err;
    res.status(status).render("listings/error.ejs", {message});
});


app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
});