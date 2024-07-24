const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/WrapAsync");
const listing = require('../models/listings');


// INDEX route
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
      res.redirect('/listings');
  }));
  
  // Show route
  router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id).populate("review");
    res.render('listings/show.ejs', { data });
  }));
  
  // Edit form route
  router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    console.log(data);
    res.render('listings/edit.ejs', { data });
  }));
  
  // Update route
  router.put('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(req.body);
    await listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.redirect('/listings');
  }));
  
  // Delete route
  router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
  }));

  module.exports=router;