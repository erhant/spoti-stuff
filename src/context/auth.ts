import { createContext } from "react";

export interface AuthInfo {
  isAuthenticated: boolean;
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export const loggedOutAuthInfo: AuthInfo = {
  isAuthenticated: false,
  accessToken: "",
  expiresIn: 0,
  tokenType: "",
};

export const AuthContext = createContext({
  authInfo: loggedOutAuthInfo,
  // this empty function will be replaced by setState at the parent App.tsx
  setAuthInfo: (authInfo: AuthInfo) => {},
});

export const SessionStorageKey = "spotistuff_auth";
