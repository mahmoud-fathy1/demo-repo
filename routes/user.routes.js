const express = require("express");
const User = require("../models/user.model");
const { route } = require("../app");
const { getProfile, getAdmin } = require("../controllers/user.controller");
const { authinticate, authorizeRole } = require("../middlewares/authorization");

const userRoutes = express.Router();

userRoutes.get("/profile", authinticate, getProfile);
userRoutes.get("/admin", authinticate, authorizeRole("user"), getAdmin);

module.exports = userRoutes;
