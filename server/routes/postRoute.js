const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const uploadMiddleware = multer({ dest: "uploads/" });

router.post(
  "/",
  authMiddleware,
  uploadMiddleware.single("file"),
  postController.createPost
);

router.delete("/:id", authMiddleware, postController.deletePost);

router.put(
  "/",
  authMiddleware,
  uploadMiddleware.single("file"),
  postController.updatePost
);

router.get("/", postController.getAllPosts);

router.get("/:id", postController.getPostById);

module.exports = router;
