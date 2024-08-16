const express = require("express");
const router = express.Router({mergeParams: true});

const { reviewSchema} = require("../schema.js");
const ListingModel = require("../models/listingModel.js");
const ReviewModel = require("../models/reviewModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};

// Post Review Route

router.post("/", validateReview, wrapAsync(async (req, res) =>{
    let listing = await ListingModel.findById(req.params.id);
    let newReview = new ReviewModel(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing.id}`)
}));

// Delte Review Route

router.delete("/:reviewId", wrapAsync(async(req, res) =>{
    let {id, reviewId} = req.params;

    await ListingModel.findByIdAndUpdate(id, {$pull: {review : reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

module.exports = router;