import * as React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
// user imports
import styles from "./styles/Header.module.scss";
import LoginButton from "./LoginButton";

function Header() {
  return (
    <header>
      <AppBar position="static">
        <Container>
          <Toolbar variant="regular">
            <Typography variant="h5" component="a" href="/" style={{ textDecoration: "none", color: "inherit" }}>
              SpotiStuff
            </Typography>
            <span style={{ flexGrow: 1 }}></span>
            <LoginButton />
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
}

export default Header;
