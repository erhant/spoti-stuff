import React, { useContext, useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
// user imports
import * as spotify from "../../api/spotify";
import { AuthContext, loggedOutAuthInfo, SessionStorageKey } from "../../context/auth";

export default function LoginButton({ backToMainMenuHandler }: { backToMainMenuHandler: () => void }) {
  const { authInfo, setAuthInfo } = useContext(AuthContext);
  const [user, setUser] = useState<spotify.User | null>(null);
  const handleLogout = () => {
    setAuthInfo(loggedOutAuthInfo);
    backToMainMenuHandler();
    window.sessionStorage.removeItem(SessionStorageKey);
  };

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
      setUser(null); // this is optional
      const res = await spotify.getCurrentUser(authInfo.accessToken);
      if (!active) {
        return;
      }
      setUser(res);
    }
  }, [authInfo.isAuthenticated]);

  return authInfo.isAuthenticated ? (
    <div>
      {user && (
        <Typography color="info" variant="h5" style={{ display: "inline", textAlign: "right" }}>
          Welcome, {user!.name}
        </Typography>
      )}
      <Button color="info" onClick={handleLogout} sx={{ ml: "2em" }} startIcon={<LogoutIcon />}>
        Logout
      </Button>
    </div>
  ) : (
    <Button color="info" href={spotify.AUTHENTICATION_HREF} startIcon={<LoginIcon />}>
      Login
    </Button>
  );
}
