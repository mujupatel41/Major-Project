const express = require("express");
const router = express.Router({mergeParams: true});

const ListingModel = require("../models/listingModel.js");
const ReviewModel = require("../models/reviewModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Post Review Route

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delte Review Route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;