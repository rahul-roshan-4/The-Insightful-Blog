const fs = require("fs");
const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: req.user.id,
      comments: [],
    });

    res.json(postDoc);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id);

    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let newPath = null;

    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const { id, title, summary, content } = req.body;

    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isAuthor = postDoc.author.toString() === req.user.id;
    if (!isAuthor) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only edit your own posts" });
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (newPath) {
      postDoc.cover = newPath;
    }

    const updatedPost = await postDoc.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findByIdAndUpdate(id, {
      $inc: { views: 0.5 },
    }).populate("author", ["username"]);
    res.json(postDoc);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
