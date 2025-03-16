if(process.env.NODE_ENV != "production") {
    require("dotenv").config();    
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

  

// routes 
// these are the parent routes
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
      
const dburl = process.env.ATLASDB_URL;

main()
.then(() => {console.log("connected to db")})
.catch((err) => console.log(err));      

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main() {
    await mongoose.connect(dburl);
}  

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret: process.env.SECRETE
    },
    touchAfter: 3600 * 24
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOpts = {         
    store, 
    secret: process.env.SECRETE, // secrete used to sign the session id cookie.      
    resave: false,
    saveUninitialized: true, 
    cookie: {      
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
       

// app.get("/", (req, res) => {
//     res.send("Hello i am root");
// })



app.use(session(sessionOpts)); // use session as middleware
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// each user is auathenticated through the LocalStrategy and 
// method used to authenticate them is User.authenticate()
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());  //store user related info in the session 
passport.deserializeUser(User.deserializeUser()); // remove user related information 


    

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews/", reviewRouter);
app.use("/", userRouter);
        


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
}) 
 
app.use((err, req, res, next) => {
    let {status=500, message="Something got wrong"} = err;
    console.log(err);
    res.status(status).render("error.ejs", { err }); 
    // res.status(status).send(message);  
    })
    

app.listen(8080, () => {
    console.log("app is listening");
});



// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",     
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfully saved");
// })



