const express = require("express");
const router = express.Router();

const {listingSchema} = require("../schema.js");
const ListingModel = require("../models/listingModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");

// Index Route

router.get("/", wrapAsync(ListingController.index));

// New Route

router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Create Route

router.post("/", validateListing, wrapAsync(ListingController.createListing));

// Show Route

router.get("/:id", wrapAsync(ListingController.showListing));

// Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

// Update Route

router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(ListingController.updateListing));

// Delete Route

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

module.exports = router;