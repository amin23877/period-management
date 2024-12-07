const express = require("express");
const passport = require("passport");
const authController = require("./../controllers/authController");

const router = express.Router();

// Auth with Google
router.get("/google", authController.googleAuth);

// Callback route for Google to redirect to
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    authController.googleCallback
);

// Logout route
router.get("/logout", authController.googleLogout);

module.exports = router;
