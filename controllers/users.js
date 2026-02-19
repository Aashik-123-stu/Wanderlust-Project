const User = require("../models/user");

module.exports.signUp = async(req,res)=>{
    try{
    let {username ,email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);

    req.login(registeredUser,(err)=>{
       if(err){
        return next(err);
       }
        req.flash("success", "welcome to the WanderLust");
        res.redirect("/listings");
    })
   
    }  catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.renderLogin = (req,res)=>{
     res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
      req.flash("success","welcome back to wanderlust ");
      let redirectUrl = res.locals.redirectUrl || "/listings"  // switch,Agar left side Empty (undefined) h, to ye automatically right side wala value utha lega.
      res.redirect(redirectUrl);   // locals me store then access
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}