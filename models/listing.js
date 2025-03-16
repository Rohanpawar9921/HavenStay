const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const Review = require("./review.js");
const { array, required } = require("joi");


const listingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description:{ 
        type: String,
    },
    image: {
            url: String,
            filename: String   
    }, 
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})


const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;





// default: {
//     url: "https://unsplash.com/photos/a-person-standing-on-top-of-a-rock-near-the-ocean-f1RanbWWY1c",
//     filename: "default_image.jpg"
// }