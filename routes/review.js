const express=require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError.js");
const Review = require("../models/reviews.js"); 
const Listing = require("../models/listing.js");   // require kiya listing.js ko
const { validateListing, validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")


// reviews post route
router.post("/",isLoggedIn, validateReview , wrapAsync (reviewController.createReview));
// review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;