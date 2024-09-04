const express = require("express");
const router = express.Router();

const {listingSchema} = require("../schema.js");
const ListingModel = require("../models/listingModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};

// Index Route

router.get("/", wrapAsync(async (req, res)=>{
    let allListings = await ListingModel.find();

    res.render("listings/index.ejs", {listings: allListings});
}));

// New Route

router.get("/new", (req, res)=>{
    res.render("listings/new.ejs");
});

// Create Route

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let newListing = await ListingModel(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

// Show Route

router.get("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id).populate("review");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// Edit Route

router.get("/:id/edit", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// Update Route

router.put("/:id", validateListing, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route

router.delete("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}));

module.exports = router;