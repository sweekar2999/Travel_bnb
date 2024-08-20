if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/review");
const userRouter=require("./routes/user.js");
const flash = require('connect-flash');
const User=require("./models/user.js");
const passport=require("passport");
const LocalStatergy=require("passport-local");


const port = 8080;

// Connect to MongoDB
const dbUrl = process.env.ATLASDB_URL; // Moved this line above the store initialization

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});

// Moved the error handling for store after its initialization
store.on("error", () => {
  console.log("err in Mongo session");
});

const sessinOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}
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

main().then(() => console.log('Database Connected')).catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

// // Routes
// app.get('/', (req, res) => {

//   res.send(`I am root.`);
// });
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.victory = req.flash("victory");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
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