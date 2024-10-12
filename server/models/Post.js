const mongoose = require("mongoose");

const Postschema = new mongoose.Schema(
  {
    post: {
      type: String,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      ref: "User",
    },
    picture: {
      type: String,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", Postschema);

module.exports = Post;
