const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccesToken, generateRefreshToken, generateResetToken } = require("../utils/generateJWTTokens");
const { sendEmail } = require("../utils/nodemailer");
const { validationResult } = require("express-validator");

async function signUpController(req, res, next) {
    try {
        let result = validationResult(req);

        if (result.isEmpty()) {
            let email = req.body.email;
            let password = req.body.password;
            let role = req.body.role;

            let hashedPassword = await bcrypt.hash(password, 12);

            let user = await User.create({
                email,
                password: hashedPassword,
                role,
            });

            return res.json({
                status: "Success",
                message: "Signup Successful",
                data: {
                    id: user._id,
                    email: user.email,
                },
            });
        }

        // console.log(result.array());
        const validationErrors = JSON.stringify(result.array());

        const error = new Error(validationErrors);
        error.statusCode = 400;
        throw error;

        // next(error);

        // res.status(404).send(result.array());
    } catch (error) {
        next(error);
    }
}

async function loginController(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and password are required.");
            error.statusCode = 400;
            throw error;
            // return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 404;
            throw error;
            // return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 404;
            throw error;
            // return res.status(401).json({ message: "Invalid email or password" });
        }

        let accessToken = generateAccesToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        let refreshToken = generateRefreshToken({
            id: user._id,
            email: user.email,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
        });

        res.json({
            status: "success",
            message: "Login successful",
        });
    } catch (error) {
        next(error);
    }
}

async function refreshTokenCintroller(req, res) {
    const refreshToken = req.cookies.refreshToken;

    // If no refresh token found
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }

    jwt.verify(refreshToken, process.env.RFRESH_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(400).json("invalid or expired token");
        }

        let accessToken = generateAccesToken({
            email: data.email,
        });
        res.cookie("accessToken", accessToken);

        res.json("new access token generated");
    });
}

async function logoutController(req, res) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
    });

    res.json("tokens cleared");
}

async function forgetPasswordFormController(req, res) {
    const html = `
    <html>
      <body>
        <h2>Forgot Password</h2>
        <form action="http://localhost:3000/auth/forget-password" method="POST">
          <label>Please Enter Your Email Address:</label><br/>
          <input type="email" name="email" required /><br/><br/>
          <button type="submit">Send Reset Link</button>
        </form>
      </body>
    </html>
  `;

    res.send(html);
}

async function forgetPasswordController(req, res) {
    let email = req.body.email;

    if (!email) return res.status(400).json({ message: "Email is required" });

    console.log(email);

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "Reset link sent (if email exists)" });
    }

    let resetToken = generateResetToken({
        id: user._id,
        email: user.email,
    });

    let to = user.email;
    let subject = "Reset your password";
    let html = `
    <p>Hello, ${user.name}</p>
    <p>Click the Button below to reset your password</p>
    <a href="http://localhost:3000/auth/reset-password/${resetToken}">Reset Password</a>
    `;

    let info = sendEmail(to, subject, html);

    res.send(`<h1>Reset Link Sent to Your Email</h1>`);
}

async function resetPasswordFormController(req, res) {
    let token = req.params.token;
    const html = `
    <html>
      <body>
        <h2>Reset Your Password</h2>
        <form action="http://localhost:3000/auth/reset-password/${token}" method="POST">
          <label>New Password:</label><br/>
          <input type="password" name="newPassword" required /><br/><br/>
          <button type="submit">Reset Password</button>
        </form>
      </body>
    </html>
  `;

    res.send(html);
}

async function resetPasswordController(req, res) {
    try {
        let resetToken = req.params.token;
        console.log(resetToken);

        let newPassword = req.body.newPassword;
        console.log(newPassword);

        let payload = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);

        let user = await User.findOne({ _id: payload.id });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.send("<h3>Password updated successfully</h3>");
    } catch (error) {
        console.log(error);
        res.status(400).send("Token invalid or expired");
    }
}

module.exports = {
    signUpController,
    loginController,
    refreshTokenCintroller,
    logoutController,
    forgetPasswordFormController,
    forgetPasswordController,
    resetPasswordFormController,
    resetPasswordController,
};
