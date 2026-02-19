if(process.env.NODE_ENV != "production"){  
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");    // to use put/patch method
const ejsMate = require("ejs-mate");      // to use ejs-mate

const expressError = require("./utils/expressError.js");     

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js");  
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");  

app.set("view engine","ejs");                    //to use view 
app.set("views",path.join(__dirname,"views"));   // to run view from outside
app.use(express.urlencoded({ extended: true }));     // get & post request me urlencoded data ko read
app.use(methodOverride("_method"));                 // to use put/patch method
app.engine('ejs',ejsMate);                  // to use ejs-mate
app.use(express.static(path.join(__dirname,"/public")));  // css and js file ko access

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.default.create({   // when new packages ko old(require) method se call to use "default" , bcz it lie in deafult box
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error",(err)=>{
    console.log("error in mongo store",err);
})
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:  7*24*60*60*1000,
        httpOnly:true
    }
};


async function main(params) {
    await mongoose.connect(dbUrl);
}
main()
.then(()=>{
    console.log("connected to Dbs");
})
.catch((err)=>{
    console.log(err);
})

app.listen(8080 ,()=>{
    console.log("server is listen to port 8080")
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  
    next();
});

app.use("/listings",listingRouter);  
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all(/(.*)/, (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

// error handling middleware
app.use((err,req,res,next)=>{ 
    let {statusCode = 500,message = "something went wrong"} = err;
   res.status(statusCode).render("error.ejs",{message});
   
})

