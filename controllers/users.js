const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async (req, res, next) => {
    try {
 
         let { username, email, password } = req.body;
         const newUser = new User({email, username});
         const registereduser = await User.register(newUser, password);  // saves the user with the password also checks for unique username
         console.log(registereduser);
         req.login(registereduser, (err) => {
             if(err) {
                 next(err);
             }
             req.flash("success", "Welcome to Wanderlust");
             res.redirect("/listings");
         })
    } catch (err) {
         req.flash("error", err.message);
         res.redirect("/signup");
    }
 
 }

 module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}