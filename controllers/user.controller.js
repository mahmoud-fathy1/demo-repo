const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function getProfile(req, res) {
    let user = await User.findById(req.user.id);
    res.json(user);
    console.log(data);
}

async function getAdmin(req, res) {
    res.send("This is Admin Data");
}

module.exports = { getProfile, getAdmin };
