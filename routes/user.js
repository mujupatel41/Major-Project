const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) =>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
    
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            };
            req.flash("success", "Welcome to Airbnb!");
            return res.redirect("/listings");
        });
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    };

 }));

 router.get("/login", (req, res) =>{
    res.render("users/login.ejs");
 });

 router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), async (req, res) =>{
    req.flash("success", "Welcome to Airbnb! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

 });

 router.get("/logout", (req, res, next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        };
        req.flash("success", "you are logged out!");
        return res.redirect("/listings");
    });
 });

module.exports = router;