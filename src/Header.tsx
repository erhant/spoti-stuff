import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import styles from "./styles/Header.module.scss"


function makeLoginURL() {
  const authEndpoint: string = "https://accounts.spotify.com/authorize";
  const clientId: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
  const redirectUri: string = "http://localhost:3000";
  const scopes: string[] = ["user-top-read", "user-read-currently-playing", "user-read-playback-state"];
  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}&response_type=token&show_dialog=true`;
}

function Header() {
  return (
    <header>
      <AppBar position="static" className={styles.appbar}>
        <Toolbar variant="regular">
          <Typography
            variant="h5"
            component="a"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
            href="/">
            SpotiStuff
          </Typography>
          <Button color="inherit" href={makeLoginURL()}>
            Login to your Spotify Account
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default Header;
