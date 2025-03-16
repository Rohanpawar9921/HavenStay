const express = require("express");
const router = express.Router({mergeParams: true});


const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

const Review = require("../models/review");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewControllers = require("../controllers/reviews");




//--------------------- REVIEW ROUTES BELOW ---------------------------

// add a review route
router.post("/", isLoggedIn, validateReview, wrapAsync (reviewControllers.createReview)
);


// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  wrapAsync (reviewControllers.destroyReview)

);





module.exports = router;