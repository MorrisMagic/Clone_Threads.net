import React, { useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import { UserContext } from "../context/AuthContext";
import axios from "axios";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import { MdVerified } from "react-icons/md";

function Profile() {
  const [activeTab, setActiveTab] = useState("threads");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { authUser, setAuthUser, setUserInfo } = useContext(UserContext);
  const [posts, setposts] = useState([]);
  console.log(authUser._id);
  const username = authUser.username;
  const toggleCreatePost = () => {
    setIsCreatePostOpen((prev) => !prev);
  };

  const handleClosePost = (e) => {
    if (e.target.id === "createPostOverlay") {
      setIsCreatePostOpen(false);
    }
  };

  // Function to handle post submission
  const handlePostSubmit = () => {
    // Here, you can add any logic for submitting the post, if needed
    // For now, just close the widget
    setIsCreatePostOpen(false);
  };

  const fetchyourcomments = async () => {
    try {
      await axios.post("/profileposts", { username }).then(({ data }) => {
        setposts(data);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchyourcomments();
  }, []);
  return (
    <div className="bg-myblack flex justify-center min-h-screen text-white  pt-5">
      <h5 className="text-white z-10 font-bold">Profile</h5>
      <div className="flex justify-center pt-11">
        <div className="w-[620px] border-[0.5px] rounded-3xl border-[#2D2D2D] h-screen flex flex-col bg-mygray fixed z-0 p-5">
          {/* Profile Section */}
          <div className="flex items-center justify-between flex-row-reverse gap-4 mb-4">
            <div className="flex-shrink-0">
              <img
                src={authUser.profile}
                alt="Profile"
                className="w-[80px] h-[80px] rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 h-full">
                <h1 className="text-3xl font-semibold">{authUser?.fullname}</h1>{" "}
                {authUser?.username === "thecreator" && (
                  <MdVerified color="#0095F6" size={20} />
                )}
              </div>
              {/* Name */}
              <p className="text-sm text-gray-400">
                @{authUser?.username}
              </p>{" "}
              {/* Username */}
              <br />
              <p>my bio</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm">
              <span className="font-semibold">
                {authUser?.followers?.length}
              </span>{" "}
              Followers
            </p>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={toggleCreatePost}
            className="bg-[#181818] border-[0.5px] border-[#2D2D2D] text-white px-4 py-1 rounded-2xl transition mb-6"
          >
            Edit Profile
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
                <p onClick={() => fetchyourcomments()}>Threads</p>
                {activeTab === "threads" && (
                  <div className=" bg-white  " />
                )}{" "}
              </div>
              <div
                className={`cursor-pointer text-center ${
                  activeTab === "replies" ? "font-semibold" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("replies")}
              >
                <p>Replies</p>
                {activeTab === "replies" && <div className=" bg-white " />}{" "}
                {/* Increased height */}
              </div>
              <div
                className={`cursor-pointer text-center ${
                  activeTab === "reposts" ? "font-semibold" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("reposts")}
              >
                <p>Reposts</p>
                {activeTab === "reposts" && <div className=" bg-white " />}{" "}
                {/* Increased height */}
              </div>
            </div>

            {/* Underline Line */}
            <div className="h-[1px] bg-white opacity-20" />
          </div>

          {/* Content based on active tab */}
          <div className="mt-4">
            {activeTab === "threads" && (
              <div>
                {posts.map((item) => (
                  <Post
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
      {isCreatePostOpen && (
        <div
          id="createPostOverlay"
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleClosePost}
        >
          <div
            className="bg-[#101010] rounded-2xl border border-[#2D2D2D] p-6 w-[600px] text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-between mb-4">
              <div className="flex flex-col gap-4 w-full">
                <div>
                  <h2 className="text-base font-semibold">Name</h2>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-[#1A1A1A] border p-2 border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>
                <div>
                  <h2 className="text-base font-semibold">Bio</h2>
                  <textarea
                    placeholder="Write a short bio"
                    className="w-full bg-[#1A1A1A] border p-2 border-[#444] rounded-md h-[70px] focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>
                <div>
                  <h2 className="text-base font-semibold">Link</h2>
                  <input
                    type="text"
                    placeholder="Add link"
                    className="w-full bg-[#1A1A1A] border p-2 border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>
              </div>
              <div className="ml-4">
                <button>
                  <img
                    src={authUser?.profile}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                    alt="User"
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                className="px-4 py-2 bg-[#171717] border border-gray-600 rounded-md hover:bg-[#1F1F1F] transition text-sm font-semibold"
                onClick={handlePostSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
