const Listing = require("./models/listing.js");
const { listingSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");
const { reviewSchema} = require("./schema");
const Review = require("./models/review.js")

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // if user is not logged then we will redirect it to the redirectUrl 
        // (the url on which user forced to the login page)
        req.session.redirectUrl = req.originalUrl;     //original url is the absolute path user want to access currently

        req.flash("error", "You will need to log in");
        return res.redirect("/login");
    }
    next();
}



module.exports.saveRedirectUrl = (req, res, next) => {
    // we save the url in the locals because passport resets the session when user is logged in 
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing); 
    if (! listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        next(new ExpressError(400, errMsg));
    } else {  
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {  
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}