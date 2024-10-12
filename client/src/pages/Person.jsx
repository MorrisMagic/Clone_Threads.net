import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { UserContext } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Person() {
  const { username } = useParams();
  const person = username.replace("@", "");
  const [activeTab, setActiveTab] = useState("threads");
  const [info, setInfo] = useState();
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { authUser } = useContext(UserContext);

  const fetchUser = async () => {
    try {
      const { data } = await axios.post("/person", { person });
      setInfo(data);

      // Check if the logged-in user is already following this user
      const currentUserId = authUser._id;
      const followingStatus = data.followers.includes(currentUserId);
      setIsFollowing(followingStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchYourComments = async () => {
    try {
      const { data } = await axios.post("/profileposts", { username: person });
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchYourComments();
  }, [person]); // Re-fetch when the username changes

  const handleFollow = async () => {
    try {
      await axios.post("/follow", { userIdToFollow: info._id });
      setIsFollowing(true);
      setInfo((prevInfo) => ({
        ...prevInfo,
        followers: [...prevInfo.followers, authUser._id], // Update local state
      }));
      localStorage.setItem(`following_${info._id}`, true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post("/unfollow", { userIdToUnfollow: info._id });
      setIsFollowing(false);
      setInfo((prevInfo) => ({
        ...prevInfo,
        followers: prevInfo.followers.filter(
          (followerId) => followerId !== authUser._id
        ),
      }));
      localStorage.setItem(`following_${info._id}`, false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const followingStatus = localStorage.getItem(`following_${info?._id}`);
    if (followingStatus !== null) {
      setIsFollowing(followingStatus === "true");
    }
  }, [info]);

  return (
    <div className="bg-myblack flex justify-center min-h-screen text-white pt-5">
      <h5 className="text-white z-10 font-bold">Profile</h5>
      <div className="flex justify-center pt-11">
        <div className="w-[620px] border-[0.5px] rounded-3xl border-[#2D2D2D] h-screen flex flex-col bg-mygray fixed z-0 p-5">
          {/* Profile Section */}
          <div className="flex items-center justify-between flex-row-reverse gap-4 mb-4">
            <div className="flex-shrink-0">
              <img
                src={info?.profile}
                alt="Profile"
                className="w-[80px] h-[80px] rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold">{info?.fullname}</h1>
              <p className="text-sm text-gray-400">@{info?.username}</p>
              <br />
              <p>my bio</p>
            </div>
          </div>

          {/* Followers Section */}
          <div className="mb-4">
            <p className="text-sm">
              <span className="font-semibold">{info?.followers?.length}</span>{" "}
              Followers
            </p>
          </div>

          {/* Follow/Unfollow Button */}
          <button
            className="bg-white text-[#2D2D2D] border-[0.5px] border-[#2D2D2D] px-4 py-1 rounded-2xl font-semibold transition mb-6"
            onClick={isFollowing ? handleUnfollow : handleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>

          {/* Tabs for Threads, Replies, Reposts */}
          <div className="flex flex-col mb-4">
            <div className="flex justify-around mb-2">
              <div
                className={`cursor-pointer text-center ${
                  activeTab === "threads" ? "font-semibold" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("threads")}
              >
                <p>Threads</p>
                {activeTab === "threads" && <div className="bg-white" />}
              </div>
              <div
                className={`cursor-pointer text-center ${
                  activeTab === "replies" ? "font-semibold" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("replies")}
              >
                <p>Replies</p>
                {activeTab === "replies" && <div className="bg-white" />}
              </div>
              <div
                className={`cursor-pointer text-center ${
                  activeTab === "reposts" ? "font-semibold" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("reposts")}
              >
                <p>Reposts</p>
                {activeTab === "reposts" && <div className="bg-white" />}
              </div>
            </div>
            <div className="h-[1px] bg-white opacity-20" />
          </div>

          {/* Content based on active tab */}
          <div className="mt-4">
            {activeTab === "threads" && (
              <div>
                {posts.map((item) => (
                  <Post
                    key={item._id}
                    id={item._id}
                    img={item.picture}
                    username={item.username}
                    likes={item.likes.length}
                    comments={item.comments.length}
                    post={item.post}
                  />
                ))}
              </div>
            )}
            {activeTab === "replies" && <p>No replies to display.</p>}
            {activeTab === "reposts" && <p>No reposts to display.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Person;
