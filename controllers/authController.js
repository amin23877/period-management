const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const passport = require("passport");

exports.protect = catchAsync(async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log(req.user);
    return next(new AppError("You need to login first.", 401));
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }

        next();
    };
};

exports.googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
});

exports.googleCallback = catchAsync(async (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(process.env.CALLBACK_URL_AFTER_LOGIN);
});

exports.googleLogout = catchAsync(async (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect(process.env.CALLBACK_URL_AFTER_LOGIN);
});
