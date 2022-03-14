import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Header() {
  function handleClick() {
    alert('heeheh');
  }

  return (
    <Box sx={{ flexGrow: 1 }} component="header">
      <AppBar position="static">
        <Toolbar variant="regular">
          <Typography
            variant="h5"
            component="div" sx={{ flexGrow: 1 }}>
            SpotiStuff
          </Typography>
          <Button
            color="inherit"
            onClick={(e) => handleClick()}>
            Login to your Spotify Account
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
