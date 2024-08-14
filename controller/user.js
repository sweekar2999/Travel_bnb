const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
    };

module.exports.signup=async (req,res,next)=>{
    try{
        let{email,username,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            else{
                req.flash("success","Welcome To Travelbnb");
                res.redirect("/listings");

            }
        })
       
    }
    catch(e){
req.flash("error",e.message);
res.redirect("/signup");
    }
 
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
    };

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome  BackTo Travelbnb");
    const redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","GoodBye");
        res.redirect("/listings");
    })
};