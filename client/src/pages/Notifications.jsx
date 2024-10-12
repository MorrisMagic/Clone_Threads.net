import React from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon

function Notifications() {
  return (
    <div className="bg-myblack flex justify-center min-h-screen text-white  pt-5">
      <h5 className="text-white z-10 font-bold">Activity</h5>
      <div className="flex justify-center pt-11">
        <div className="w-[620px] border-[0.5px] rounded-3xl border-[#2D2D2D] h-screen flex bg-mygray fixed z-0 p-5"></div>
      </div>
    </div>
  );
}

export default Notifications;
