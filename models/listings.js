const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
      type: String,
      default: "https://unsplash.com/photos/a-beach-with-waves-coming-in-to-shore-and-palm-trees-in-the-background-PF23iOhQeZE",
      set:(v)=>v===""?"https://unsplash.com/photos/a-beach-with-waves-coming-in-to-shore-and-palm-trees-in-the-background-PF23iOhQeZE":v
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  review:[{
    type:Schema.Types.ObjectId,
    ref:'Review',
  }]
});
listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.review}});
  }
})
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
