// controllers/likeController.js

const Post = require("../models/Post");

const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId, action } = req.body;

  try {
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (action === "like") {
      postDoc.likes += 1;
      postDoc.likedBy.push(userId);
      console.log("liked");
    } else {
      postDoc.likes -= 1;
      postDoc.likedBy = postDoc.likedBy.filter((id) => id !== userId);
      console.log("disliked" + userId);
    }

    await postDoc.save();

    res.json({
      success: true,
      likes: postDoc.likes,
      username: postDoc.author._id,
    });
  } catch (error) {
    res.status(500).send({ error: "An error occurred while liking the post" });
  }
};

const unlikePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).send({ error: "Post not found" });
    }

    const index = postDoc.likedBy.indexOf(userId);
    if (index === -1) {
      return res.status(400).send({ error: "User has not liked this post" });
    }

    postDoc.likedBy.splice(index, 1);
    postDoc.likes -= 1;
    await postDoc.save();

    res.json({ success: true, likes: postDoc.likes });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while unliking the post" });
  }
};

module.exports = {
  likePost,
  unlikePost,
};
