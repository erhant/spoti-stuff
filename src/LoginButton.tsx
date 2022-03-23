import * as React from 'react';
import Button from '@mui/material/Button';
// import { getUserWelcomeMessage } from './api/spotify'
// import { makeLoginURL, AUTH_STORAGE_KEY } from './api/auth'
import { AuthContext } from './context/auth'


export default function LoginButton() {
  const { authenticated, setAuthenticated } = React.useContext(AuthContext);
  const handleLogin = () => setAuthenticated(true);
  const handleLogout = () => setAuthenticated(false);

  /*
  < Button color="inherit" href={makeLoginURL()} >
      Login to Spotify!
    </Button >

  */
  if (authenticated) {
    return (
      < Button color="inherit" onClick={handleLogout} >
        Logout.
      </Button >
    )
  } else {
    return (
      < Button color="inherit" onClick={handleLogin}  >
        Login!
      </Button >
    )
  }

}