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

const listings = require("./routes/listing.js");

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

app.use("/listings", listings);

// Review Route 

// Post Review Route

app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) =>{
    let listing = await ListingModel.findById(req.params.id);
    let newReview = new ReviewModel(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing.id}`)
}));

// Delte Review Route

app.delete("/listings/:id/review/:reviewId", wrapAsync(async(req, res) =>{
    let {id, reviewId} = req.params;

    await ListingModel.findByIdAndUpdate(id, {$pull: {review : reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
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