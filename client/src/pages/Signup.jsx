import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
function Signup() {
  const [fullname, setfullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await axios.post("/signup", { fullname, username, email, password });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[#101010] h-screen">
      <div className="flex justify-center items-center h-screen flex-col gap-7">
        <h1 className="text-white font-bold text-[30px]">
          Create your account
        </h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-[300px] h-11 rounded-lg p-3 bg-[#1E1E1E] text-white"
            value={fullname}
            onChange={(e) => setfullname(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="w-[200px] h-11 rounded-lg p-3 bg-[#1E1E1E] text-white"
            maxLength={20}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-[300px] h-11 rounded-lg p-3 bg-[#1E1E1E] text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            className="w-[300px] h-11 rounded-lg p-3 bg-[#1E1E1E] text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={signup}
          className="bg-white text-black py-3 px-[130px] rounded-lg"
        >
          Signup
        </button>
        <Link to={"/login"}>
          <p className="text-white underline">Login</p>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
