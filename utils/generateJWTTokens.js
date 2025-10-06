const jwt = require("jsonwebtoken");

function generateAccesToken(payload) {
    let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
    });

    return token;
}
function generateRefreshToken(payload) {
    let token = jwt.sign(payload, process.env.RFRESH_TOKEN_SECRET, {
        expiresIn: "1y",
    });

    return token;
}

function generateResetToken(payload) {
    let token = jwt.sign(payload, process.env.RESET_TOKEN_SECRET, {
        expiresIn: "10m",
    });

    return token;
}

module.exports = { generateAccesToken, generateRefreshToken, generateResetToken };
