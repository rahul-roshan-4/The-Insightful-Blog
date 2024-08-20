const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  addComment,
  getCommentById,
  deleteComment,
} = require("../controllers/commentController");

router.post("/add-comment", authMiddleware, addComment);
router.get("/getComment/:commentId", getCommentById);
router.delete("/deletecomment/:id", deleteComment);

module.exports = router;
