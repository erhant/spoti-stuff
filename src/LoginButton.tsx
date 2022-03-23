import React, { useContext, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import * as spotify from "./api/spotify";
import { AuthContext, loggedOutAuthInfo } from "./context/auth";

export default function LoginButton() {
  const { authInfo, setAuthInfo } = useContext(AuthContext);
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const handleLogout = () => setAuthInfo(loggedOutAuthInfo);

  // load username on login
  // https://stackoverflow.com/questions/53715465/can-i-set-state-inside-a-useeffect-hook
  useEffect(() => {
    if (!authInfo.isAuthenticated) return;

    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      setWelcomeMsg(""); // this is optional
      const msg = await spotify.getUserWelcomeMessage(authInfo.accessToken);
      if (!active) {
        return;
      }
      setWelcomeMsg(msg);
    }
  }, [authInfo.isAuthenticated]);

  if (authInfo.isAuthenticated) {
    return (
      <div>
        <span>{welcomeMsg}</span>
        <Button color="inherit" onClick={handleLogout} sx={{ ml: "2em" }}>
          Logout
        </Button>
      </div>
    );
  } else {
    return (
      <Button color="inherit" href={spotify.createLoginURL()}>
        Login
      </Button>
    );
  }
}
