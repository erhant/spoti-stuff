export type User = {
  name: string;
  id: string;
  externalURL: string;
  imageURL: string;
} | null;
export type PlaylistInfo = {
  name: string;
  numTracks: number;
  href: string;
  playlistCover: string;
  id: string;
} | null;
export type TrackInfo = {
  album: {
    name: string;
    year: string;
    id: string;
    imageURL: string;
    externalURL: string;
  };
  artist: {
    name: string;
    id: string;
    externalURL: string;
  };
  name: string;
  id: string;
  externalURL: string;
} | null;
export type ProgressState = {
  numPlaylists: number;
  donePlaylists: number;
  currentPlaylist: PlaylistInfo;
} | null;

// Docs: https://developer.spotify.com/documentation/web-api/reference/#/

// General config
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:3000";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
const SCOPES = ["user-top-read", "user-read-currently-playing", "user-read-playback-state", "playlist-read-private"];
export const LOGIN_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
  "%20"
)}&response_type=token&show_dialog=true`;

// Convert undefined image urls to the placeholder
const safeImage = (item: any): string => {
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0].url;
  } else {
    return "/img/unavailable.png";
  }
};

/**
 * https://developer.spotify.com/console/get-current-user/
 *
 * @param {string} accessToken
 * @return {User} user
 */
export async function getCurrentUser(accessToken: string): Promise<User> {
  let res;
  res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res = await res.json();
  console.log(res);
  return {
    name: res.display_name,
    id: res.id,
    externalURL: res.external_urls.spotify,
    imageURL: safeImage(res),
  };
}
/**
 * https://developer.spotify.com/console/get-users-profile/
 *
 * @param {string} accessToken
 * @param {string} userID
 * @return {User} user
 */
export async function getUser(accessToken: string, userID: string): Promise<User> {
  let res;
  res = await fetch("https://api.spotify.com/v1/users/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res = await res.json();
  console.log(res);

  return {
    name: res.display_name,
    id: res.id,
    externalURL: res.external_urls.spotify,
    imageURL: safeImage(res),
  };
}

/**
 * https://developer.spotify.com/console/get-users-currently-playing-track/
 *
 * @param {string} accessToken
 * @return {TrackInfo} track
 */
export async function getCurrentlyPlayingTrack(accessToken: string): Promise<TrackInfo> {
  let res;
  res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res = await res.json();
  // console.log(res);

  return {
    album: {
      name: res.item.album.name,
      year: res.item.album.release_date,
      id: res.item.album.id,
      externalURL: res.item.album.external_urls.spotify,
      imageURL: safeImage(res.item.album),
    },
    artist: {
      name: res.item.artists[0].name,
      id: res.item.artists[0].id,
      externalURL: res.item.artists[0].external_urls.spotify,
    },
    name: res.item.name,
    id: res.item.id,
    externalURL: res.item.external_urls.spotify,
  };
}
export async function getTrack(accessToken: string, trackID: string): Promise<TrackInfo> {
  let res;
  res = await fetch("https://api.spotify.com/v1/tracks/" + trackID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  res = await res.json();
  // console.log(res);

  return {
    album: {
      name: res.album.name,
      year: res.album.release_date,
      id: res.album.id,
      externalURL: res.album.external_urls.spotify,
      imageURL: safeImage(res.album),
    },
    artist: {
      name: res.artists[0].name,
      id: res.artists[0].id,
      externalURL: res.artists[0].external_urls.spotify,
    },
    name: res.name,
    id: res.id,
    externalURL: res.external_urls.spotify,
  };
}

export async function findTrackInUserPlaylists(
  accessToken: string,
  trackStr: string,
  setProgressState: (state: ProgressState) => void,
  setTrackState: (state: TrackInfo) => void
): Promise<PlaylistInfo[]> {
  // get track info
  const targetTrackID: string = trackStr.split("?")[0].split("/").at(-1)!; // parse track string to obtain track id, it is the string between furthest '/' and the '?'
  const trackInfo: TrackInfo = await getTrack(accessToken, targetTrackID);
  // update model track
  setTrackState(trackInfo);
  // console.log("Searching for", trackInfo);

  const playlists = await getCurrentUserPlaylists(accessToken);
  // console.log(playlists);

  // search the track in eachplaylist
  const matchedPlaylists: PlaylistInfo[] = [];
  for (let i = 0; i < playlists.length; ++i) {
    // update model progress
    setProgressState({
      numPlaylists: playlists.length,
      donePlaylists: i + 1,
      currentPlaylist: playlists[i],
    });
    const trackIDs: string[] = await getTrackIDsInPlaylist(accessToken, playlists[i]!.id);
    if (trackIDs.includes(targetTrackID)) {
      matchedPlaylists.push(playlists[i]);
    }
  }

  return matchedPlaylists;
}

export async function getCurrentUserPlaylists(accessToken: string): Promise<PlaylistInfo[]> {
  let playlists: PlaylistInfo[] = [];
  let nextURL: string | null =
    "https://api.spotify.com/v1/me/playlists?fields=items(id,name,tracks(total),href,images)&limit=50";
  let res;
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
          playlistCover: safeImage(i),
          id: i.id,
        };
      })
    );
    nextURL = res.next;
  } while (nextURL);

  return playlists;
}
export async function getUserPlaylists(accessToken: string, userID: string): Promise<PlaylistInfo[]> {
  let playlists: PlaylistInfo[] = [];
  let nextURL: string | null =
    "https://api.spotify.com/v1/users/" +
    userID +
    "/playlists?fields=items(id,name,tracks(total),href,images)&limit=50";
  let res;
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
          playlistCover: safeImage(i),
          id: i.id,
        };
      })
    );
    nextURL = res.next;
  } while (nextURL);

  return playlists;
}

/**
 * https://developer.spotify.com/console/get-playlist-tracks/
 *
 * Only retrieve trackIDs for faster requests.
 *
 * @param {string} accessToken
 * @param {string} playlistID
 */
export async function getTrackIDsInPlaylist(accessToken: string, playlistID: string): Promise<string[]> {
  let trackIDs: string[] = [];
  let nextURL: string | null =
    "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks?fields=next,items(track(id))&limit=50";
  do {
    let res;
    res = await fetch(nextURL!, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res = await res.json();
    trackIDs = trackIDs.concat(res.items.map((i: any) => i.track.id));

    nextURL = res.next;
  } while (nextURL);

  return trackIDs;
}
