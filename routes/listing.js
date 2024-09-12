const express = require("express");
const router = express.Router();

const {listingSchema} = require("../schema.js");
const ListingModel = require("../models/listingModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const ListingController = require("../controllers/listings.js");

// Index Route
// Create Route

router.route("/")
.get(wrapAsync(ListingController.index))
.post(validateListing, wrapAsync(ListingController.createListing))

router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Show Route
// Update Route
// Delete Route

router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(validateListing, isLoggedIn, isOwner, wrapAsync(ListingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing))

// Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = router;