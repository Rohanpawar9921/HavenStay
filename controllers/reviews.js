const Review = require("../models/review.js");
const Listing = require("../models/listing");


module.exports.createReview = async (req, res, next) => {
    let {id} = req.params;

    // new review created
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    let listing = await Listing.findById(id);  //find the listing
    listing.reviews.push(newReview);   //add review to the listing
    let result = await newReview.save();  //save the review
    let result2 = await listing.save()
    req.flash("success", "New Review Created!");    

    console.log(result); 
    console.log(result2); 
    res.redirect(`/listings/${id}`);

}



module.exports.destroyReview = async (req, res, next) => {
    let { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");  

    res.redirect(`/listings/${id}`);
}