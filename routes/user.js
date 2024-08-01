const express=require("express");
const User=require("../models/user");
const router=express.Router();
const wrapAsync=require("../utils/WrapAsync");
const passport=require("passport");
router.get("/signup",(req,res)=>{
res.render("users/signup");
})
router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let{email,username,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.flash("success","Welcome To Travelbnb");
        res.redirect("/listings");
    }
    catch(e){
req.flash("error",e.message);
res.redirect("/signup");
    }
 
}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
    })
    router.post("/login",  passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),async (req,res)=>{
        req.flash("success","Welcome  BackTo Travelbnb");
        res.redirect("/listings");
    })
module.exports=router;