const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync");
// const { userSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users.js")



router
.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync (userController.signup));

router
.route("/login")
.get( userController.renderLoginForm)
.post(
    saveRedirectUrl,      //strategy local
     passport.authenticate("local", {
        // options
         failureRedirect: "/login",
         failureFlash: true
    }),
    userController.login);



router.get("/logout", userController.logout);

module.exports = router;