import * as React from 'react';
import Button from '@mui/material/Button';
import { getUserWelcomeMessage } from './api/spotify'
import { makeLoginURL, AUTH_STORAGE_KEY } from './api/auth'

export default function LoginButton() {
  if (window.localStorage.getItem(AUTH_STORAGE_KEY)) {
    return (
      <span>
        {getUserWelcomeMessage()}
      </span>
    )
  } else {
    return (
      < Button color="inherit" href={makeLoginURL()} >
        Login to Spotify!
      </Button >
    )
  }
}