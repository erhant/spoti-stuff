import React, { useContext, useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
// user imports
import * as spotify from "./api/spotify";
import { User } from "./types/spotify";
import { AppSelection, SetAppSelection } from "./types/mainmenu";
import { AuthContext, loggedOutAuthInfo } from "./context/auth";

export default function LoginButton({ sel, setSel }: { sel: AppSelection; setSel: SetAppSelection }) {
  const { authInfo, setAuthInfo } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const handleLogout = () => {
    setAuthInfo(loggedOutAuthInfo);
    setSel(AppSelection.None);
    window.sessionStorage.removeItem(process.env.REACT_APP_SPOTISTUFF_AUTHKEY!);
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
      {user ? (
        <>
          <span>
            Welcome {user!.name}
            {/* <Avatar alt="user pic" src={user!.imageURL} sx={{}} /> */}
          </span>
        </>
      ) : (
        <></>
      )}
      <Button color="inherit" onClick={handleLogout} sx={{ ml: "2em" }} startIcon={<LogoutIcon />}>
        Logout
      </Button>
    </div>
  ) : (
    <Button color="inherit" href={spotify.LOGIN_URL} startIcon={<LoginIcon />}>
      Login
    </Button>
  );
}
