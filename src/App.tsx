import React, { useEffect, useState } from "react";
// user imports
import MainMenu from "./components/mainmenu";
import { AuthContext, loggedOutAuthInfo, AuthInfo } from "./context/auth";

// used to obtain the token from spotify redirection
function parseHash(hash: string): AuthInfo {
  // the given string is of form "#key1=val1&key2=val2&key3=val3"
  // there is a generic-one-liner for this, but i want to be more explicit
  const kvs = hash.slice(1).split("&");
  return {
    isAuthenticated: true,
    accessToken: kvs[0].split("=")[1],
    expiresIn: parseInt(kvs[2].split("=")[1]),
    tokenType: kvs[1].split("=")[1],
  };
}

function App() {
  const [authInfo, setAuthInfo] = useState(loggedOutAuthInfo);

  // componentDidMount
  useEffect(() => {
    if (window.location.hash.length > 0) {
      // redirected from spotify
      const authInfo = parseHash(window.location.hash);
      setAuthInfo(authInfo);
      window.sessionStorage.setItem(process.env.REACT_APP_SPOTISTUFF_AUTHKEY!, JSON.stringify(authInfo));
    } else {
      // refreshed, check session storage for the authentication keys
      if (window.sessionStorage.getItem(process.env.REACT_APP_SPOTISTUFF_AUTHKEY!)) {
        setAuthInfo(JSON.parse(window.sessionStorage.getItem(process.env.REACT_APP_SPOTISTUFF_AUTHKEY!)!));
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
      <MainMenu />
    </AuthContext.Provider>
  );
}

// <span>{JSON.stringify(authInfo)}</span>

export default App;
