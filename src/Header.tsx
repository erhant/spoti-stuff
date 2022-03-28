import * as React from "react";
import { AppBar, Toolbar, Typography, Container, Fab } from "@mui/material";
// user imports
import styles from "./styles/Header.module.scss";
import LoginButton from "./LoginButton";
import { AppSelection, SetAppSelection } from "./types/mainmenu";

function Header({ sel, setSel }: { sel: AppSelection; setSel: SetAppSelection }) {
  return (
    <header>
      <AppBar position="static">
        <Container>
          <Toolbar variant="regular">
            <Typography variant="h5" style={{ textDecoration: "none", color: "inherit" }}>
              SpotiStuff
            </Typography>
            {
              /* Render the return button if not in menu */
              sel === AppSelection.None ? (
                <></>
              ) : (
                <Typography
                  component="a"
                  onClick={() => setSel(AppSelection.None)}
                  variant="h5"
                  style={{ textDecoration: "none", color: "inherit", marginLeft: "1em" }}
                >
                  Main Menu
                </Typography>
              )
            }
            {/* empty component to push button to the right*/}
            <span style={{ flexGrow: 1 }}></span>
            <LoginButton sel={sel} setSel={setSel} />
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
}

export default Header;
