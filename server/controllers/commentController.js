const Comment = require("../models/commentModel");
const Post = require("../models/Post");

const addComment = async (req, res) => {
  const { postId, text } = req.body;

  try {
    const decodedToken = req.user;
    const post = await Post.findById(postId).populate("author", ["username"]);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = await Comment.create({
      text,
      author: {
        id: decodedToken.id,
      },
    });

    post.comments.push(newComment._id);
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const getCommentById = async (req, res) => {
  const { commentId } = req.params;
  try {
    const commentDoc = await Comment.findById(commentId).populate({
      path: "author.id",
      model: "User",
      select: "username",
    });

    if (!commentDoc) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const { text, author } = commentDoc;
    res.json({ text, author });
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const postInfo = req.body;

    const post = await Post.findById(postInfo.postId).populate("author", [
      "username",
    ]);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments = post.comments.filter(
      (commentId) => commentId.toString() !== id
    );

    await post.save();

    await Comment.findByIdAndDelete(id);

    res.status(200).json(post);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addComment,
  getCommentById,
  deleteComment,
};
