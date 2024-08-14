const listing=require("../models/listings.js");
module.exports.Index=async (req, res) => {
    let data = await listing.find({});
    res.render('listings/index.ejs', { data });
  };
  

module.exports.renderNewForm=(req, res) => {
  
    res.render('listings/new.ejs');
  };

module.exports.createListing=async (req, res, next) => {
  let url=req.file.path;
  let filename=req.file.filename;
 
    const newListing = new listing(req.body);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "Successfully created New Listing");
    res.redirect('/listings');
  };

module.exports.showListing=async (req, res) => {
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

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    if(!data){
      req.flash("error","Listing you are looking to edit doesnt exist!");
      res.redirect("/listings");
    }
    console.log(data);
    res.render('listings/edit.ejs', { data });
  };

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
   
    console.log(req.body);
    await listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
     listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Successfully Updated Listing");

    res.redirect('/listings');
  };

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Successfully Deleted Listing");

    res.redirect('/listings');
  };