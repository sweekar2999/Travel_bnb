const express=require("express");
const router=express.Router();
const multer = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage }); // Using local storage for now
const wrapAsync=require("../utils/WrapAsync");
const listing = require('../models/listings');
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controller/listing.js");

// Index route
router.route("/")
.get( listingController.Index)
.post(isLoggedIn,upload.single('image'),  wrapAsync(listingController.createListing)
);
  


// Create form route
router.get('/new',isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('image'), wrapAsync(listingController.updateListing))
.delete( isLoggedIn ,isOwner,wrapAsync(listingController.destroyListing));

// router.get('/', listingController.Index);
  

  router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
  
 
 // Create new listing
// router.post('/', wrapAsync(listingController.createListing));
  
  // Show route
  // router.get('/:id', wrapAsync(listingController.showListing));
  
  // // Edit form route
  // router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
  
  // // Update route
  // router.put('/:id',isLoggedIn,isOwner, wrapAsync(listingController.updateListing));
  
  // // Delete route
  // router.delete('/:id', isLoggedIn ,isOwner,wrapAsync(listingController.destroyListing));

  module.exports=router;