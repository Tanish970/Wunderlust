const mongoose = require('mongoose');
const schema=mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/brown-and-black-wooden-house-TiVPTYCG_3E",
        set: (v) => v === "" ? "https://unsplash.com/photos/brown-and-black-wooden-house-TiVPTYCG_3E" : v,
    },
    price: Number,
    location: String,
    country: String
});


const Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;
