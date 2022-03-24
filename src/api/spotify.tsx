const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:3000";
const SCOPES = ["user-top-read", "user-read-currently-playing", "user-read-playback-state"];

// Docs: https://developer.spotify.com/documentation/web-api/reference/#/

export async function getUserWelcomeMessage(accessToken: string): Promise<string> {
  const reqBody = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  // console.log(reqBody);
  let res = await fetch("https://api.spotify.com/v1/me", reqBody);
  res = await res.json();
  // console.log(res);
  // @ts-ignore
  return `Welcome ${res.display_name!}`;
}

export interface PlaybackState {
  deviceName: string;
  isPlaying: boolean;
  albumCover: string;
  artistName: string;
  songName: string;
  releaseDate: string;
};
export async function getUserPlaybackState(accessToken: string): Promise<PlaybackState> {
  const reqBody = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  let res = await fetch("https://api.spotify.com/v1/me/player", reqBody);
  res = await res.json();
  console.log(res);

  return {
    // @ts-ignore
    deviceName: res.device.name,
    // @ts-ignore
    isPlaying: res.is_playing,
    // @ts-ignore
    albumCover: res.item.album.images[0].url,
    // @ts-ignore
    artistName: res.item.artists[0].name,
    // @ts-ignore
    songName: res.item.name,
    // @ts-ignore
    releaseDate: res.item.album.release_date.slice(0, 4)
  };

}



export function createLoginURL(): string {
  const clientId: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
  return `${AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
    "%20"
  )}&response_type=token&show_dialog=true`;
}
