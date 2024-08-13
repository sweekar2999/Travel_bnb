const Listing = require("./models/listings.js");
const Review=require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
      req.flash("error", "You must be signed in");
      return res.redirect("/login");
    }
    next();
  }

  module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = '/listings'; // Default redirect
    }
    delete req.session.redirectUrl; // Clear it from the session
    next();
  }
  module.exports.isOwner= async (req,res,next)=>{
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
  }
  module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You do not have permission to do that");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (error) {
        console.error(error);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
  }