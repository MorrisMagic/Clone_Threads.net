const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"], // Email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      type: String,
      required: true,
      default: "default-profile-pic-url.jpg", // Default profile picture
    },
    bio: {
      type: String,
      maxlength: 160,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "banned", "inactive"],
      default: "active",
    },
    notificationSettings: {
      follows: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);
UserSchema.pre("findOneAndUpdate", async function (next) {
  const userId = this.getQuery()._id; // Get the user ID being updated
  const update = this.getUpdate();

  // If the profile picture is being updated, propagate the change to posts
  if (update.profile) {
    await Post.updateMany({ user: userId }, { picture: update.profile });
  }

  next();
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
