const express = require("express");
const router = express.Router();

const {listingSchema} = require("../schema.js");
const ListingModel = require("../models/listingModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const ListingController = require("../controllers/listings.js");

// Index Route
// Create Route

router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,  upload.single("listing[image]"), validateListing, wrapAsync(ListingController.createListing))

router.get("/new", isLoggedIn, ListingController.renderNewForm);

// Search Route

router.get("/search", wrapAsync(ListingController.searchListing));

// Show Route
// Update Route
// Delete Route

router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing))

// Edit Route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

// Filter Route

router.get("/filter/:category", wrapAsync(ListingController.filterListing));


module.exports = router;