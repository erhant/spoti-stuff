const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:3000";
const SCOPES = ["user-top-read", "user-read-currently-playing", "user-read-playback-state"];

export async function getUserWelcomeMessage(accessToken: string) {
  try {
    const reqBody = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    //console.log(reqBody);
    let res = await fetch("https://api.spotify.com/v1/me", reqBody);
    res = await res.json();
    // console.log(res);
    // @ts-ignore
    return `Welcome ${res.display_name!}`;
  } catch (err) {
    console.log(err);
    return "error!";
  }
}

export function createLoginURL() {
  const clientId: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
  return `${AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
    "%20"
  )}&response_type=token&show_dialog=true`;
}
