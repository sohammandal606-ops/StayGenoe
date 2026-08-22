const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware/middleware");
const userController = require("../controllers/users");
const { storage } = require("../cloudConfig");
const multer = require('multer');
const upload = multer({ storage });

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        storeReturnTo,
        passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
        userController.login
    );


router.get("/logout", userController.logout);

router.get("/profile", (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to view your profile");
        return res.redirect("/login");
    }
    next();
}, wrapAsync(userController.renderProfile));

router.post("/profile/image",
    (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash("error", "You must be logged in to update your profile");
            return res.redirect("/login");
        }
        next();
    },
    upload.single('user[image]'),
    wrapAsync(userController.uploadProfileImage)
);

module.exports = router;
