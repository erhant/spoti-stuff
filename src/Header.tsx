import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import styles from "./styles/Header.module.scss"

// TODO: can we use styles without class, but just apply to header?
function Header() {
  function handleClick() {
    alert('heeheh');
  }

  return (
    <header>
      <AppBar position="static" sx={{ paddingLeft: "10vw" }} className={styles.header}>
        <Toolbar variant="regular">
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}>
            SpotiStuff
          </Typography>
          <Button
            color="inherit"
            onClick={(e) => handleClick()}>
            Login to your Spotify Account
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default Header;
