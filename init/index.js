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
    initData.data=initData.data.map((obj)=>({...obj,owner:'66b0e286a274f60c8595a2cf'}));
    await Listing.insertMany(initData.data);
    // await Listing.insertMany(initData);

    console.log("data was initializex");
}
initDB();