import { createContext, ReactChild, useContext, useState } from "react";
import UserType from "../types/user";

const defaultUserState: UserType = {
  isAuthenticated: false,
};
const UserContext = createContext({
  user: defaultUserState,
  // this empty function will be replaced by setState at the parent App.tsx
  setUser: (user: UserType) => {},
});

type Props = {
  children: ReactChild;
};
export const UserContextWrapper = ({ children }: Props) => {
  const [user, setUser] = useState(defaultUserState);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  return useContext(UserContext);
}
