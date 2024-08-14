const express=require("express");
const User=require("../models/user");
const router=express.Router();
const wrapAsync=require("../utils/WrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controller/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),userController.login)

// router.get("/signup",userController.renderSignupForm);
// router.post("/signup",wrapAsync(userController.signup));
// router.get("/login",userController.renderLoginForm);
// router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),userController.login)
router.get("/logout",userController.logout);
module.exports=router;

