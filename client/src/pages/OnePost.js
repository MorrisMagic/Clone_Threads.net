import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import Post from "../components/Post";

function OnePost() {
  // State to track the active tab

  return (
    <div className="bg-myblack flex justify-center min-h-screen text-white  pt-5">
      <h5 className="text-white z-10 font-bold">Thread</h5>
      <div className="flex justify-center pt-11">
        <div className="w-[620px] border-[0.5px] rounded-3xl border-[#2D2D2D] h-screen flex flex-col bg-mygray fixed">
          <Post />
          <div className="pl-7 pt-5">
            <p className="text-white z-10 font-bold">Replies</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnePost;
