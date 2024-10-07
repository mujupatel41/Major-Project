const mongoose = require("mongoose");
const ReviewModel = require("./reviewModel");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum: ["castles", "trending", "beach", "pools", "lake", "camping", "farming", "treehouse", "iconic"],
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await ReviewModel.deleteMany({_id: {$in: listing.review}});
    }
    
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;