import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Aside from "./components/Aside";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Post from "./components/Post";
import OnePost from "./pages/OnePost";
import Person from "./pages/Person";
import axios from "axios";
import { UserContext } from "./context/AuthContext";
import { io } from "socket.io-client";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;
const socket = io("http://localhost:5000");

function App() {
  const location = useLocation(); // Get current route

  const { authUser, setAuthUser, setUserInfo } = useContext(UserContext);

  const fetchdata = async () => {
    try {
      await axios.get("/profile").then(({ data }) => {
        setAuthUser(data);
        console.log(authUser);
      });
    } catch (error) {
      console.log(error);
      setAuthUser(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const hideSidebarRoutes = ["/login", "/signup"];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {!hideSidebarRoutes.includes(location.pathname) && <Aside />}

      <div className="flex-1 bg-myblack pt-1">
        <Routes>
          <Route
            index
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/search"
            element={authUser ? <Search /> : <Navigate to={"/login"} />}
          />
          <Route path="/activity" element={<Notifications />} />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to={"/"} /> : <Signup />}
          />
          <Route
            path="/post"
            element={authUser ? <OnePost /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/:username"
            element={authUser ? <Person /> : <Navigate to={"/login"} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
