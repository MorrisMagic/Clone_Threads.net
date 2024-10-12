import React, { useContext, useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6"; // Import both icons
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { LuSend } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/AuthContext";
import axios from "axios";
import { MdVerified } from "react-icons/md";

import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Post(props) {
  const { authUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`/post/${props.id}`, {
          withCredentials: true,
        });
        setLikes(response.data.likes);
        setIsLiked(response.data.likes.includes(authUser._id));
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();

    socket.on("likeUpdated", ({ postid, likes }) => {
      if (postid === props.id) {
        setLikes(likes);
        setIsLiked(likes.includes(authUser._id));
      }
    });

    return () => {
      socket.off("likeUpdated");
    };
  }, [props.id, authUser._id]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        "/like",
        { postid: props.id },
        { withCredentials: true }
      );
      setLikes(response.data.likes);
      setIsLiked(response.data.likes.includes(authUser._id));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUsernameClick = () => {
    if (authUser.username === props.username) {
      navigate("/profile");
    } else {
      navigate(`/@${props.username}`);
    }
  };

  return (
    <div className="border-b-[0.5px] border-[#383939]">
      <div className="flex gap-3 pl-5 flex-col">
        <div className="flex gap-3 items-center p-3">
          <div className="mt-[-25px]">
            <img
              src={props.img}
              width={42}
              height={42}
              className="rounded-full object-cover"
              alt={`${props.username}'s profile`}
            />
          </div>
          <div>
            <div className="flex flex-col gap-1">
              <p
                onClick={handleUsernameClick}
                className="text-[14px] font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  {props.username}
                  {props.username === "thecreator" && (
                    <MdVerified color="#0095F6" size={16} />
                  )}
                </div>
              </p>
              <p>{props.post}</p>
            </div>
            <div className="flex items-center gap-5 mt-4 justify-start cursor-pointer">
              <div className="flex items-center gap-2" onClick={handleLike}>
                {isLiked ? (
                  <FaHeart color="red" /> // Show filled heart when liked
                ) : (
                  <FaRegHeart color="#C9C9C9" /> // Show empty heart when not liked
                )}
                <p className="text-[12px]">{likes.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaRegComment color={"#C9C9C9"} />
                <p className="text-[12px]">{props.comments}</p>
              </div>
              <div className="flex items-center gap-1">
                <BiRepost size={20} color={"#C9C9C9"} />
              </div>
              <div className="flex items-center">
                <LuSend color={"#C9C9C9"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
