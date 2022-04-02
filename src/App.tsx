import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// user imports
import MainMenu from "./components/mainmenu";
import { AuthContext, loggedOutAuthInfo, AuthInfo, SessionStorageKey } from "./context/auth";

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

// Material Theme overrides
const theme = createTheme({
  palette: {
    primary: {
      // spotify dark
      main: "#191414",
    },
    secondary: {
      // spotify green
      main: "#1db954",
    },
    success: {
      // spotify lighter green
      main: "#1ed760",
    },
    error: {
      // Tangerine
      main: "#ff4632",
    },
    warning: {
      // factory yellow
      main: "#fae62d",
    },
    info: {
      // white
      main: "#ffffff",
    },
  },
});

function App() {
  const [authInfo, setAuthInfo] = useState(loggedOutAuthInfo);

  // componentDidMount
  useEffect(() => {
    if (window.location.hash.length > 0) {
      // redirected from spotify
      const authInfo = parseHash(window.location.hash);
      setAuthInfo(authInfo);
      window.sessionStorage.setItem(SessionStorageKey, JSON.stringify(authInfo));
    } else {
      // refreshed, check session storage for the authentication keys
      if (window.sessionStorage.getItem(SessionStorageKey)) {
        setAuthInfo(JSON.parse(window.sessionStorage.getItem(SessionStorageKey)!));
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
      <ThemeProvider theme={theme}>
        <MainMenu />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

// <span>{JSON.stringify(authInfo)}</span>

export default App;
