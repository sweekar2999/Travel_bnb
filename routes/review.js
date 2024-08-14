const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync");
const Listing = require('../models/listings');
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware");
const {isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controller/review.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(err => err.message).join(', '), 400);
    } else {
        next();
    }
};

// Review post
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;