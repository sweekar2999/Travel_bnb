const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/WrapAsync");
const listing = require('../models/listings');


// Index route
router.get('/', async (req, res) => {
    let data = await listing.find({});
    res.render('listings/index.ejs', { data });
  });
  
  // Create form route
  router.get('/new', (req, res) => {
  
    res.render('listings/new.ejs');
  });
  
  // Create new listing
  router.post('/', wrapAsync(async (req, res,next) => {
      const newListing = new listing(req.body);
      await newListing.save();
      req.flash("success","Successfully created New Listing");
      res.redirect('/listings');
  }));
  
  // Show route
  router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id).populate("review");
    if(!data){
      req.flash("error","Listing you are looking for doesnt exist!");
      res.redirect("/listings");
    }
    

    res.render('listings/show.ejs', { data });
  }));
  
  // Edit form route
  router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    if(!data){
      req.flash("error","Listing you are looking to edit doesnt exist!");
      res.redirect("/listings");
    }
    console.log(data);
    res.render('listings/edit.ejs', { data });
  }));
  
  // Update route
  router.put('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(req.body);
    await listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    req.flash("success","Successfully Updated Listing");

    res.redirect('/listings');
  }));
  
  // Delete route
  router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Successfully Deleted Listing");

    res.redirect('/listings');
  }));

  module.exports=router;