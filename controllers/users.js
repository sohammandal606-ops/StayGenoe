const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to StayGenoe!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to StayGenoe!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};

module.exports.renderProfile = async (req, res) => {
    const Listing = require("../models/listing");
    const Review = require("../models/review");

    // Check if user is logged in (should be handled by middleware in route, but safeer here too)
    if (!req.user) {
        req.flash("error", "You must be logged in to view your profile");
        return res.redirect("/login");
    }

    const listings = await Listing.find({ owner: req.user._id });
    const reviews = await Review.find({ author: req.user._id }).populate("author");


    res.render("users/profile.ejs", { user: req.user, listings, reviews });
};

module.exports.uploadProfileImage = async (req, res) => {
    if (!req.file) {
        req.flash("error", "No image uploaded!");
        return res.redirect("/profile");
    }

    const user = await User.findById(req.user._id);
    user.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    await user.save();

    req.flash("success", "Profile picture updated!");
    res.redirect("/profile");
};
