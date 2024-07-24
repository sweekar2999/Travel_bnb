const initData=require("./data.js");
const Listing=require("../models/listings.js");
const mongoose = require('mongoose');
main().then(()=>console.log("database Connected"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    // await Listing.insertMany(initData);

    console.log("data was initializex");
}
initDB();