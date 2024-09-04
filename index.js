const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const app = express();
const port = 8080;

const sessionOptions = {
    secret: "mujupatel41",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);

main().then((res)=>{
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Testing Route

app.get("/", (req, res)=>{
    res.send("Hii I am @mujupatel41");
});

// Demo User

app.get("/demouser", async (req, res) =>{
    let demoUser = new User({
        email: "Student@gmail.com",
        username: "Delta-Student",
    });

    let registeredUser = await User.register(demoUser, "hellomuju");
    res.send(registeredUser);
})

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);

// Error Handling

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    let {status = 500, message = "Something Went Wrong!"} = err;
    res.status(status).render("listings/error.ejs", {message});
});

app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
});