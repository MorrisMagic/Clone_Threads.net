import { createContext, useState } from "react";

export const UserContext = createContext(false);

export function UserContextProvider({ children }) {
  const [authUser, setAuthUser] = useState(false);
  const [userinfo, setUserInfo] = useState(false);

  return (
    <UserContext.Provider
      value={{ authUser, setAuthUser, userinfo, setUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
}
