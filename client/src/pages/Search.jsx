import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import axios from "axios";
import { MdVerified } from "react-icons/md";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setResults([]); // Clear results if the query is empty
      return;
    }

    try {
      const response = await axios.get(`/search`, {
        params: { query },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="bg-myblack flex justify-center min-h-screen text-white pt-5">
      <h5 className="text-white z-10 font-bold">Search</h5>
      <div className="flex justify-center pt-11">
        <div className="w-[620px] border-[0.5px] rounded-3xl border-[#2D2D2D] h-screen flex flex-col items-start gap-7 bg-mygray fixed z-0 p-5">
          <div className="flex h-11 items-center p-5 w-full bg-[#0A0A0A] rounded-2xl">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="w-full h-[40px] bg-transparent outline-none text-white"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {results.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <img
                src={user.profile}
                width={40}
                className="rounded-full"
                alt=""
              />
              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h4 className="font-semibold">{user.username}</h4>
                  {user.username === "thecreator" && (
                    <MdVerified color="#0095F6" size={16} />
                  )}
                </div>

                <p className="font-normal text-[15px] text-[#777777]">
                  {user.fullname}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
