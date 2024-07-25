const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/WrapAsync");
const listing = require('../models/listings');
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      throw new ExpressError(error.details.map(err => err.message).join(', '), 400);
    } else {
      next();
    }
  };
//Review
//post
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let { id } = req.params;
    let data= await listing.findById(id);
    /**
     * also can use this but change the name in show.ejs of rating and coment
     *   let { rating, comment } = req.body;
    let newReview = new Review({ rating, comment });
     */
    let newReview=new Review(req.body.review);
     data.review.push(newReview);
     await newReview.save();
      await data.save();
    req.flash("victory","Successfully Posted A Review!");

      res.redirect(`/listings/${id}`);
  }))
  //delete review
  router.delete("/:reviewId",async (req,res)=>{
    let{id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("victory","Successfully Deleted A Review!");
    res.redirect(`/listings/${id}`);
  })

  module.exports=router;