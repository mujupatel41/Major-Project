const ListingModel = require("../models/listingModel.js");
const ReviewModel = require("../models/reviewModel.js");

module.exports.createReview = async (req, res) =>{
    let listing = await ListingModel.findById(req.params.id);
    let newReview = new ReviewModel(req.body.review);

    newReview.author = req.user._id;
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Reveiw Created!");

    res.redirect(`/listings/${listing.id}`)
};

module.exports.destroyReview = async(req, res) =>{
    let {id, reviewId} = req.params;

    await ListingModel.findByIdAndUpdate(id, {$pull: {review : reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
};