const ListingModel = require("../models/listingModel.js");

module.exports.index = async (req, res)=>{
    let allListings = await ListingModel.find().sort({ _id: -1 });

    res.render("listings/index.ejs", {listings: allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = await ListingModel(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id).populate({path: "review", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_300");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await ListingModel.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    await ListingModel.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
};

module.exports.filterListing = async (req, res)=>{
    let {category} = req.params;
    let filterListing = await ListingModel.find({category: category})
    res.render("listings/index.ejs", {listings: filterListing});
};

module.exports.searchListing = async (req, res)=>{
    let input = req.query.q.trim().replace(/\s+/g, " "); // remove start and end space and middle space remove and middle add one space------
    
    if (input == "" || input == " ") {
		//search value empty
		req.flash("error", "Search value empty !!!");
		res.redirect("/listings");
	}

    // convert every word 1st latter capital and other small---------------
	let data = input.split("");
	let element = "";
	let flag = false;
	for (let index = 0; index < data.length; index++) {
		if (index == 0 || flag) {
			element = element + data[index].toUpperCase();
		} else {
			element = element + data[index].toLowerCase();
		}
		flag = data[index] == " ";
	}

    let allListing = await ListingModel.find({
		title: { $regex: element, $options: "i" },
	});
    if (allListing.length != 0) {
		res.locals.success = "Listings searched by Title";
		res.render("listings/index.ejs", { listings: allListing });
		return;
	}

    if (allListing.length == 0) {
		allListing = await ListingModel.find({
			category: { $regex: element, $options: "i" },
		}).sort({ _id: -1 });
		if (allListing.length != 0) {
			res.locals.success = "Listings searched by Category";
			res.render("listings/index.ejs", { listings: allListing });
			return;
		}
	}

    if (allListing.length == 0) {
		allListing = await ListingModel.find({
			country: { $regex: element, $options: "i" },
		}).sort({ _id: -1 });
		if (allListing.length != 0) {
			res.locals.success = "Listings searched by Country";
			res.render("listings/index.ejs", { listings: allListing });
			return;
		}
	}

    if (allListing.length == 0) {
		let allListing = await ListingModel.find({
			location: { $regex: element, $options: "i" },
		}).sort({ _id: -1 });
		if (allListing.length != 0) {
			res.locals.success = "Listings searched by Location";
			res.render("listings/index.ejs", { listings: allListing });
			return;
		}
	}

    if (allListing.length == 0) {
		req.flash("error", "Listings is not here !!!");
		res.redirect("/listings");
	}
};