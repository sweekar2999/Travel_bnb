const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/review");
const userRouter=require("./routes/user.js");
const flash = require('connect-flash');
const User=require("./models/user.js");
const passport=require("passport");
const LocalStatergy=require("passport-local");
const port = 8080;
const sessinOptions={ secret: 'your_secret_key',
  resave: false, 
  saveUninitialized: false, 
  cookie: { expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
   }}
// Middleware setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session middleware
app.use(session(sessinOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB
main().then(() => console.log('Database Connected')).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// Routes
app.get('/', (req, res) => {

  res.send(`I am root.`);
});
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
res.locals.victory=req.flash("victory");
res.locals.error=req.flash("error");
  next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { message = "something went wrong", status = 500 } = err;
  res.status(status).render("error.ejs", { err });
});

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
