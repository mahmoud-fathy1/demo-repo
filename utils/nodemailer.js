const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(to, subject, html) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to:", to);
        return info;
    } catch (err) {
        console.error("❌ Email sending failed:", err.message);
        throw new Error("Failed to send email");
    }
}

module.exports = { sendEmail };
