import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import styles from "./styles/Header.module.scss";
import LoginButton from "./LoginButton";

function Header() {
  return (
    <header>
      <AppBar position="static" className={styles.appbar}>
        <Toolbar variant="regular">
          <Typography
            variant="h5"
            component="a"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
            href="/"
          >
            SpotiStuff
          </Typography>
          <LoginButton />
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default Header;
