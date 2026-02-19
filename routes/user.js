const express=require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRediredtUrl } = require("../middleware.js");
const userController = require("../controllers/users.js")

router.route("/signup")
      .get(userController.renderSignup)
      .post(wrapAsync (userController.signUp));


router.route("/login")
      .get(userController.renderLogin)
      .post(saveRediredtUrl,  // call middleware for res.locals
        passport.authenticate("local",{     // to authenticate  valid user
        failureRedirect: "/login",  // (options)if invalid redirect to  login page
        failureFlash: true,         // (options) flash if failure
    }), userController.login)


router.get("/logout",userController.logout)
module.exports = router;