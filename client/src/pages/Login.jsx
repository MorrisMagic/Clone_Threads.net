import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { authUser, setAuthUser, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate(); // Use useNavigate for redirection

  const login = async () => {
    try {
      const { data } = axios.post("/login", { username, password });
      setAuthUser(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[#101010] h-screen">
      <div className="flex justify-center items-center h-screen flex-col gap-7">
        <h1 className="text-white font-bold text-[30px]">
          Log in with your account
        </h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-[300px] h-11 rounded-lg p-3 bg-[#1E1E1E] text-white"
        />
        <input
          type="text"
          placeholder="Password"
          className="w-[300px] h-11 rounded-lg p-3 bg-[#1E1E1E] text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          className="bg-white text-black py-3 px-[130px] rounded-lg"
        >
          Log in
        </button>
        <Link to={"/signup"}>
          <p className="text-white underline">Signup</p>
        </Link>
      </div>
    </div>
  );
}

export default Login;
