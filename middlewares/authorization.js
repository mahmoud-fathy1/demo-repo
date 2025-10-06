const jwt = require("jsonwebtoken");

function authinticate(req, res, next) {
    const token = req.cookies.accessToken;
    console.log(token);

    if (!token) {
        return res.status(400).json({
            status: "error",
            data: "missing JWT token",
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(403).json({ status: "failed", message: "Invalid or expired token" });
            return;
        }

        req.user = payload;
        next();
    });
}

// function isAdmin(req, res, next) {
//     if (req.user.role !== "admin") {
//         return res.status(403).send("Access Denied");
//     }

//     next();
// }

function authorizeRole(role) {
    return function (req, res, next) {
        if (req.user.role !== role) {
            return res.status(403).send("Access Denied");
        }
        next();
    };
}

module.exports = { authinticate, authorizeRole };
