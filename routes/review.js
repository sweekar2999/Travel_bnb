const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync");
const Listing = require('../models/listings');
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware");
const {isReviewAuthor}=require("../middleware.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(err => err.message).join(', '), 400);
    } else {
        next();
    }
};

// Review post
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview); // Changed from review to reviews
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully posted a review!");
    res.redirect(`/listings/${id}`);
}));

// Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;