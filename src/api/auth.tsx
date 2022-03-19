
export const AUTH_STORAGE_KEY = 'authInfo'
export interface AuthInfo { access_token: string, expires_in: number, token_type: string };


export function checkAuthentication(verbose: boolean = false) {
  if (window.localStorage.getItem(AUTH_STORAGE_KEY) === null) {
    // not logged in, could be initial state or after redirection
    const str: string = window.location.hash; // gets the access token from redirection
    if (str.length > 0) {
      /* a not so pretty one liner
      const authInfo: { [key: string]: string } = str.slice(1).split('&').reduce((obj, x) =>
        Object.assign(obj, { [x.split('=')[0]]: x.split('=')[1] })
        , {});
      */
      const kvs = str.slice(1).split('&');
      const authInfo: AuthInfo = {
        access_token: kvs[0].split('=')[1],
        expires_in: parseInt(kvs[2].split('=')[1]),
        token_type: kvs[1].split('=')[1]
      }
      if (verbose)
        console.log(authInfo)
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authInfo));
    }
  } else {
    // logged in
    const authInfo = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY)!);
    if (verbose)
      console.log(authInfo)
  }
}

export function makeLoginURL() {
  const authEndpoint: string = "https://accounts.spotify.com/authorize";
  const clientId: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
  const redirectUri: string = "http://localhost:3000";
  const scopes: string[] = ["user-top-read", "user-read-currently-playing", "user-read-playback-state"];

  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}&response_type=token&show_dialog=true`;
}