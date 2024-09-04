const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) =>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
    
        let registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to Airbnb!");
        res.redirect("/listings");
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }

 }))

module.exports = router;