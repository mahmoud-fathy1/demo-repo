const express = require("express");
const { body } = require("express-validator");
const {
    signUpController,
    loginController,
    refreshTokenCintroller,
    logoutController,
    forgetPasswordController,
    resetPasswordFormController,
    resetPasswordController,
    forgetPasswordFormController,
} = require("../controllers/auth.controller");
const User = require("../models/user.model");

const authRoutes = express.Router();

authRoutes.post(
    "/signup",
    body("email", "error")
        .notEmpty()
        .isEmail()
        .withMessage("")
        .normalizeEmail()
        .custom(async (value) => {
            let user = await User.findOne({ email: { $gt: "" } });

            if (user) {
                throw new Error("Email already in use");
            }

            return true;
        })
        .customSanitizer((value) => {
            let newValue = value.toLowerCase();
            return newValue;
        }),
    body("password").isLength({ min: 5 }),
    body("confirmPassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("password mismatch");
            }

            return true;
        })
        .customSanitizer((value) => {}),
    signUpController
);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logoutController);
authRoutes.get("/refresh-token", refreshTokenCintroller);

authRoutes.get("/forget-password", forgetPasswordFormController);
authRoutes.post("/forget-password", forgetPasswordController);
authRoutes.get("/reset-password/:token", resetPasswordFormController);
authRoutes.post("/reset-password/:token", resetPasswordController);

module.exports = authRoutes;
