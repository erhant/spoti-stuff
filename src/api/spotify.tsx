import { AUTH_STORAGE_KEY } from './auth'

export function getUserWelcomeMessage() {
  if (window.localStorage.getItem(AUTH_STORAGE_KEY)) {
    return "Welcome, Erhan"
  } else {
    return "Login to your Spotify Account"
  }
}

