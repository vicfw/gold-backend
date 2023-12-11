const express = require("express");
const globalErrorHandler = require("./controller/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const app = express();

const userRouter = require("./routes/userRoutes");
const priceRouter = require("./routes/priceRoutes");
const AppError = require("./utils/appError");

app.set("trust proxy", 1);
app.enable("trust proxy");

app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());
app.use(helmet());

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!',
// });
// app.use('/api', limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/prices", priceRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
