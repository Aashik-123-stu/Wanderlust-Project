const express=require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing.js");   // require kiya listing.js ko
const {isLoggedIn, isowner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")

const multer = require('multer')
const {storage} = require("../cloudConflict.js");  
const upload = multer({storage})  // files ko uplods naam ke flder me save

// Upar controllers require kiya hoga aapne
const listingControllers = require("../controllers/listings");   

// index route && post new route
router
    .route("/")
    .get(wrapAsync (listingController.index))
    .post(isLoggedIn , upload.single('listing[image]'),validateListing ,wrapAsync (listingController.createListings))
    

//new route create
router.get("/new", isLoggedIn ,listingController.renderNewForm)

// to use search button
router.get("/search", wrapAsync(listingControllers.searchListings));   

// show route &&  update route && delete route
router.route("/:id")
      .get(wrapAsync (listingController.showListings))
      .put(isLoggedIn,isowner ,upload.single('listing[image]'), validateListing, wrapAsync (listingController.updateListing))
      .delete(isLoggedIn ,isowner ,  wrapAsync(listingController.destroyListing))
 

// edit route
router.get("/:id/edit",isLoggedIn ,isowner , wrapAsync(listingController.renderEditform)
)

module.exports = router;