import * as React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
// user imports
import styles from "./styles/Header.module.scss";
import LoginButton from "./LoginButton";

function Header() {
  return (
    <Container>
      <AppBar position="static" className={styles.appbar}>
        <Toolbar variant="regular">
          <Typography variant="h5" component="a" href="/" style={{ textDecoration: "none", color: "inherit" }}>
            SpotiStuff
          </Typography>
          <span style={{ flexGrow: 1 }}></span>
          <LoginButton />
        </Toolbar>
      </AppBar>
    </Container>
  );
}

export default Header;
