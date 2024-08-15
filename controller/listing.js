const listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAP_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.Index = async (req, res) => {
    let data = await listing.find({});
    res.render('listings/index.ejs', { data });
  };
  

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
  };

module.exports.createListing = async (req, res, next) => {
    try {
        const response = await geocoder.forwardGeocode({
            query: req.body.location,
            limit: 1
        }).send();
        
     
        let url = req.file.path;
        let filename = req.file.filename;
 
        const newListing = new listing(req.body);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry=response.body.features[0].geometry;
       

        let savedListing=await newListing.save();
        console.log(savedListing);
        req.flash("success", "Successfully created New Listing");
        res.redirect('/listings');
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Failed to create listing");
        res.redirect('/listings/new');
    }
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id)
    .populate({
        path: "review",
        populate: {
            path: "author"
        }
    })
    .populate("owner");
    if(!data){
      req.flash("error","Listing you are looking for doesnt exist!");
      res.redirect("/listings");
    }
    

    res.render('listings/show.ejs', { data });
  };

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    if(!data){
      req.flash("error","Listing you are looking to edit doesnt exist!");
      res.redirect("/listings");
    }
    console.log(data);
    let originalUrl = data.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/c_scale,h_250,w_250");
    res.render('listings/edit.ejs', { data, originalUrl });
  };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
   
    console.log(req.body);
    await listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
     listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success","Successfully Updated Listing");

    res.redirect('/listings');
  };

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Successfully Deleted Listing");

    res.redirect('/listings');
  };