require("dotenv").config();
const express = require("express");
const connectdb = require("./connectdb");
const User = require("./models/User");
const bcyrpt = require("bcrypt");
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");
const salt = bcyrpt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const cors = require("cors");
const Post = require("./models/Post");
const { faker } = require("@faker-js/faker");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { fullname, username, email, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const hasedpass = bcyrpt.hashSync(password, salt);
    if (user) {
      return res.status(302).json({ message: "User Already exists" });
    }

    const newUser = new User({
      fullname,
      username,
      email,
      profile:
        "https://i.pinimg.com/564x/ab/89/af/ab89af2b5b273aca5d56f25d534c412a.jpg",
      password: hasedpass,
    });
    if (newUser) {
      newUser.save();
      jwt.sign(
        { id: newUser._id, fullname, username, email },
        process.env.JWT_S,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: newUser._id,
            fullname,
            username,
            email,
          });
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});
app.post("/login", async (req, res) => {
  console.log("hello");
  const { username, password } = req.body;
  console.log({ username, password });
  try {
    const user = await User.findOne({ username });
    const passok = bcyrpt.compareSync(password, user?.password || "");

    if (passok) {
      jwt.sign(
        { id: user._id, username, email: user.email, profile: user.profile },
        process.env.JWT_S,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({ message: "mrigl" });
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});
app.put("/updateProfile", async (req, res) => {
  const { token } = req.cookies;
  const { newProfilePicture } = req.body; // New profile picture URL

  try {
    const user = jwt.verify(token, process.env.JWT_S);
    await User.findOneAndUpdate(
      { _id: user.id },
      { profile: newProfilePicture }
    );

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/generateTestData", async (req, res) => {
  try {
    const users = [];
    const posts = [];

    // Generate 10 users
    for (let i = 0; i < 10; i++) {
      const fullname = faker.person.fullName();
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const profile = faker.image.avatar();

      const newUser = new User({
        fullname,
        username,
        email,
        password: bcyrpt.hashSync(password, salt),
        profile,
      });

      users.push(newUser);
    }

    // Save users to the database
    await User.insertMany(users);

    // Generate 10 posts for each user
    for (const user of users) {
      for (let j = 0; j < 10; j++) {
        const postText = faker.lorem.sentence();
        const newPost = new Post({
          post: postText,
          user: user._id,
          username: user.username,
          picture: user.profile,
        });

        posts.push(newPost);
      }
    }

    // Save posts to the database
    await Post.insertMany(posts);

    res.json({ message: "Test data generated successfully!" });
  } catch (error) {
    console.error("Error generating test data:", error);
    res.status(500).json({ error: "Server error while generating test data." });
  }
});

app.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "No search query provided." });
  }

  try {
    // Use a regex to match usernames that start with the query
    const regex = new RegExp(`^${query}`, "i"); // 'i' for case-insensitive
    const results = await User.find({ username: regex }).select("-password");

    res.json(results);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_S, {}, async (err, info) => {
      if (err) throw err;
      const user = await User.findOne({ username: info.username }).select(
        "-password"
      );
      res.json(user);
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/follow", async (req, res) => {
  const { token } = req.cookies;
  const { userIdToFollow } = req.body; // User ID of the person to follow

  try {
    jwt.verify(token, process.env.JWT_S, async (err, info) => {
      if (err) throw err;

      const followerId = info.id;

      // Find users
      const follower = await User.findById(followerId);
      const followedUser = await User.findById(userIdToFollow);

      if (!follower || !followedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Avoid duplicate follows
      if (follower.following.includes(userIdToFollow)) {
        return res.status(400).json({ error: "Already following" });
      }

      // Update the following and followers
      follower.following.push(userIdToFollow);
      followedUser.followers.push(followerId);

      await follower.save();
      await followedUser.save();

      // Emit follow event
      io.emit("userFollowed", { followerId, followedUserId: userIdToFollow });

      res.json({ message: "Followed successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/unfollow", async (req, res) => {
  const { token } = req.cookies;
  const { userIdToUnfollow } = req.body; // User ID of the person to unfollow

  try {
    jwt.verify(token, process.env.JWT_S, async (err, info) => {
      if (err) throw err;

      const unfollowerId = info.id;

      // Find users
      const unfollower = await User.findById(unfollowerId);
      const unfollowedUser = await User.findById(userIdToUnfollow);

      if (!unfollower || !unfollowedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Remove from following and followers
      unfollower.following = unfollower.following.filter(
        (id) => id.toString() !== userIdToUnfollow
      );
      unfollowedUser.followers = unfollowedUser.followers.filter(
        (id) => id.toString() !== unfollowerId
      );

      await unfollower.save();
      await unfollowedUser.save();

      // Emit unfollow event
      io.emit("userUnfollowed", {
        unfollowerId,
        unfollowedUserId: userIdToUnfollow,
      });

      res.json({ message: "Unfollowed successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/logout", (req, res) => {
  try {
    res.clearCookie("token").json({ message: "token removed" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/post", async (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_S, {}, (err, info) => {
      if (err) throw err;
      console.log(info);
      const { text } = req.body;
      const post = new Post({
        post: text,
        user: info.id,
        username: info.username,
        picture: info.profile,
      });
      if (post) {
        post.save();
        res.json(post);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/posts", async (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_S, {}, async (err, info) => {
      if (err) throw err;
      const post = await Post.find({}).sort({
        createdAt: -1,
      });
      if (post) {
        res.json(post);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
app.post("/profileposts", async (req, res) => {
  const { token } = req.cookies;
  const { username } = req.body;
  try {
    jwt.verify(token, process.env.JWT_S, {}, async (err, info) => {
      if (err) throw err;
      const post = await Post.find({ username }).sort({ createdAt: -1 });
      if (post) {
        res.json(post);
        console.log(post);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/person", (req, res) => {
  const { person } = req.body;
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_S, {}, async (err, info) => {
      if (err) throw err;
      const user = await User.findOne({ username: person }).select("-password");
      if (user) {
        res.json(user);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
app.post("/like", async (req, res) => {
  const { token } = req.cookies;
  const { postid } = req.body; // Get the post ID from the request body
  try {
    jwt.verify(token, process.env.JWT_S, async (err, info) => {
      if (err) throw err;

      const userId = info.id;
      const post = await Post.findById(postid);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Toggle like
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((like) => like.toString() !== userId);
      } else {
        post.likes.push(userId);
      }

      await post.save();
      // Emit event to all connected clients
      io.emit("likeUpdated", { postid, likes: post.likes });
      res.json(post);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username profile"
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post); // Return post data including likes
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

io.on("connection", (soc) => {
  console.log("wlecome");
});

server.listen(port, () => {
  connectdb();
  console.log(`Server is running on http://localhost:${port}`);
});
