const express = require("express");
const Post = require("../models/post.model");
const { route } = require("../app");
const { getAllPosts, createPost } = require("../controllers/post.controller");

const postsRouter = express.Router();

postsRouter.get("/", getAllPosts);

postsRouter.post("/", createPost);

module.exports = postsRouter;
