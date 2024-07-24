const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listings.js");
const reviews=require("./routes/review.js");


const port = 8080;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
//in this case u dont need joi but u can use joi for schema validation
// const validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);
//   if (error) {
//     throw new ExpressError(error.details.map(err => err.message).join(', '), 400);
//   } else {
//     next();
//   }
// };

// Connect to MongoDB
main().then(() => console.log('Database Connected')).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Routes
app.get('/', (req, res) => {
  res.send('I am root');
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*",(req,res,next)=>{
  next(new ExpressError("Page Not Found",404));
  // throw new  ExpressError("Page Not Found",404);

})
app.use((err,req,res,next)=>{
  let{message="something went wrong",status=500}=err;
  res.render("error.ejs",{err});
 
})
