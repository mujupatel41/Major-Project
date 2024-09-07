const express = require("express");
const router = express.Router({mergeParams: true});

const ListingModel = require("../models/listingModel.js");
const ReviewModel = require("../models/reviewModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn } = require("../middleware.js");

// Post Review Route

router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) =>{
    let listing = await ListingModel.findById(req.params.id);
    let newReview = new ReviewModel(req.body.review);

    newReview.author = req.user._id;
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Reveiw Created!");

    res.redirect(`/listings/${listing.id}`)
}));

// Delte Review Route

router.delete("/:reviewId", wrapAsync(async(req, res) =>{
    let {id, reviewId} = req.params;

    await ListingModel.findByIdAndUpdate(id, {$pull: {review : reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;