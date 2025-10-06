const express = require("express");
const postsRouter = require("./routes/post.routes");
const logger = require("./middlewares/logger");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const app = express();

const limiter1 = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

function globalErrorHanldingMiddleware(err, req, res, next) {
    console.log("Error happened", err);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message,
    });
}

app.use(helmet());
// app.use(limiter);
// app.use(mongoSanitize());

app.use(logger);
app.use("/posts", postsRouter);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.use(globalErrorHanldingMiddleware);
module.exports = app;
