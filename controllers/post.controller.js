const Post = require("../models/post.model.js");
const capitalizeWords = require("../utils/capitalizeWords.js");

async function getAllPosts(req, res) {
    const posts = await Post.find();
    res.json({
        status: "successfull",
        data: posts,
    });
}

async function createPost(req, res) {
    const newPost = req.body;

    if (!newPost.title) {
        res.status(400).json({
            status: "Error",
            data: "Title is missing!",
        });
        return;
    }

    if (!newPost.content) {
        res.status(400).json({
            status: "Error",
            data: "Content is missing!",
        });
        return;
    }

    let newTitle = capitalizeWords(newPost.title);

    const createdPost = await Post.create({
        title: newTitle,
        content: newPost.content,
    });

    res.json({
        status: "Success",
        data: createdPost,
    });
}

module.exports = { getAllPosts, createPost };
