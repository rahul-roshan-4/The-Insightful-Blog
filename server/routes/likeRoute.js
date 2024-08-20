// routes/likeRoutes.js

const express = require("express");
const router = express.Router();
const { likePost, unlikePost } = require("../controllers/likeController");

// Route for liking a post
router.post("/post/like/:id", likePost);

// Route for unliking a post
router.post("/post/unlike/:id", unlikePost);

module.exports = router;
