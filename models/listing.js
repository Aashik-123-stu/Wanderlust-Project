const mongoose = require("mongoose");
const Review = require("./reviews.js");
// define schema
const listingSchema = new mongoose.Schema({
    title:{
       type: String,
       required : true
    }, 
    description:String,
    image: {
    url: String,
    filename: String,
  },
    price:Number,
    location:String,
    country:String,
    category: {    // chnages
        type: String,
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"]
    },
    reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
// use  post middleware jab listing delete kre to reviews bhi delete ho jaye
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})
// create collection
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;