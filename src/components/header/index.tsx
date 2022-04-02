import * as React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
// user imports
import styles from ".style.module.scss";
import LoginButton from "../loginButton";

export default function Header({
  isInMainMenu,
  backToMainMenuHandler,
}: {
  isInMainMenu: boolean;
  backToMainMenuHandler: () => void;
}) {
  return (
    <header>
      <AppBar position="static">
        <Container>
          <Toolbar variant="regular">
            <Typography variant="h5" color="info" style={{ textDecoration: "none" }}>
              SpotiStuff
            </Typography>
            {
              /* Render the return button if not in menu */
              !isInMainMenu && (
                <Typography
                  component="a"
                  onClick={backToMainMenuHandler}
                  variant="h5"
                  style={{ textDecoration: "underline", color: "inherit", marginLeft: "1em" }}
                >
                  Main Menu
                </Typography>
              )
            }
            {/* empty component to push button to the right*/}
            <span style={{ flexGrow: 1 }}></span>
            <LoginButton backToMainMenuHandler={backToMainMenuHandler} />
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
}
