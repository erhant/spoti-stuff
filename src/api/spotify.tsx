const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:3000";
const CLIENT_ID = "fd8dc3094bdc4c91b96e4f84970d62b1";
const SCOPES = ["user-top-read", "user-read-currently-playing", "user-read-playback-state"];

// Docs: https://developer.spotify.com/documentation/web-api/reference/#/

export async function getUserWelcomeMessage(accessToken: string): Promise<string> {
  // console.log(reqBody);
  let res;
  res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res = await res.json();
  // console.log(res);
  return `Welcome ${res.display_name!}`;
}

export type PlaybackState = {
  deviceName: string;
  isPlaying: boolean;
  albumCover: string;
  artistName: string;
  songName: string;
  releaseDate: string;
} | null;
export async function getUserPlaybackState(accessToken: string): Promise<PlaybackState> {
  let res;
  res = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res = await res.json();
  console.log(res);

  return {
    deviceName: res.device.name,
    isPlaying: res.is_playing,
    albumCover: res.item.album.images[0].url,
    artistName: res.item.artists[0].name,
    songName: res.item.name,
    releaseDate: res.item.album.release_date.slice(0, 4),
  };
}

type TrackInfo = {
  name: string;
  artistName: string;
  albumName: string;
  albumCover: string;
  id: string;
};
type PlaylistInfo = {
  name: string;
  numTracks: number;
  href: string;
};
export type SearchState = {
  track: TrackInfo;
} | null;
export async function findTrackInUserPlaylists(
  accessToken: string,
  trackStr: string,
  setState: (state: SearchState) => void
): Promise<SearchState> {
  // parse track string to obtain track id, it is the string between furthest '/' and the '?'
  const targetTrackID: string = trackStr.split("?")[0].split("/").at(-1)!;
  // get track info
  let res;
  res = await fetch(`https://api.spotify.com/v1/tracks/${targetTrackID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res = await res.json();
  const trackInfo: TrackInfo = {
    name: res.name,
    artistName: res.artists[0].name,
    albumName: res.album.name,
    albumCover: res.album.images[0].url,
    id: targetTrackID,
  };
  console.log("Searching for", trackInfo);

  // get user playlists
  let playlists: PlaylistInfo[] = [];
  let nextURL: string | null = "https://api.spotify.com/v1/me/playlists?limit=50";
  do {
    res = await fetch(nextURL!, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res = await res.json();
    playlists = playlists.concat(
      res.items.map((i: any) => {
        return {
          name: i.name,
          numTracks: i.tracks.total,
          href: i.href,
        };
      })
    );
    nextURL = res.next;
  } while (nextURL);
  console.log(playlists);

  // search the track in eachplaylist
  const matchedPlaylists: PlaylistInfo[] = [];
  for (let i = 0; i < playlists.length; ++i) {
    let trackIDs: string[] = [];
    nextURL = playlists[i].href + "/tracks?fields=next,items(track(id))&limit=50";
    do {
      res = await fetch(nextURL!, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      res = await res.json();
      console.log(res);
      nextURL = res.next;
      trackIDs = trackIDs.concat(res.items.map((i: any) => i.track.id));
    } while (nextURL);
    console.log(playlists[i]);
    console.log(trackIDs);
    if (trackIDs.includes(targetTrackID)) {
      matchedPlaylists.push(playlists[i]);
    }
  }

  // TODO: update state while searching
  // TODO: return nice info

  console.log(matchedPlaylists);
  return null;
}

export function createLoginURL(): string {
  return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
    "%20"
  )}&response_type=token&show_dialog=true`;
}
