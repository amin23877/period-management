require("./utils/passport-setup");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const periodRouter = require("./routes/periodRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

app.enable("trust proxy");

// Implement CORS
// app.use(cors());
// Access-Control-Allow-Origin *
// api.aminoddole.com, front-end aminoddole.com
app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
    })
);

app.options("*", cors());
// app.options('/api/v1/tours/:id', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
    max: process.env.REQUEST_RATE_LIMIT,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
//use whitelist for params you want to get multiple times in single query
app.use(
    hpp({
        whitelist: [],
    })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req);
    next();
});

// Middleware for sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// 3) ROUTES
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/period", periodRouter);
app.use("/api/v1/auth", authRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
