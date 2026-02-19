const Listing = require("./models/listing");
const Review = require("./models/reviews");
const expressError = require("./utils/expressError.js");     
const { listingSchema ,reviewSchema} = require("./schema.js"); 

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;   

        if (req.originalUrl.includes("/reviews") && req.method !== "GET") {
            let listingId = req.originalUrl.split("/")[2]; 
            req.session.redirectUrl = `/listings/${listingId}`;
        }
        
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
    }
     next();
};

module.exports.saveRediredtUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
}

module.exports.isowner = async (req,res,next)=> {
     let { id } = req.params;
  // if hopscoth se access to first verify
      let listing = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
          req.flash("error","you are not the owner of this listing");
          return res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    
    if (error) {
        // Correct Logic: Pehle saare messages ka array banao (map), fir unhe join karo.
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new expressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    
    if (error) {
        // Correct Logic: Pehle saare messages ka array banao (map), fir unhe join karo.
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new expressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=> {
     let {id,reviewId } = req.params;
  // if hopscoth se access to first verify
      let review = await Review.findById(reviewId);
      if(!review.author.equals(res.locals.currUser._id)){
          req.flash("error","you are not the auther of this review ");
          return res.redirect(`/listings/${id}`);
      }
      next();
}