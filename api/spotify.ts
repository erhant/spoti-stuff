import { User, TrackInfo, PlaylistInfo, ShortTrackInfo, TrackAudioFeatures } from "../types/spotify"

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const REDIRECT_URI = process.env.REDIRECT_URI
const CLIENT_ID = "fd8dc3094bdc4c91b96e4f84970d62b1"
const SCOPES = ["user-top-read", "user-read-currently-playing", "user-read-playback-state", "playlist-read-private"]
export const AUTHENTICATION_HREF = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(
  "%20"
)}&response_type=token&show_dialog=true`

// Convert undefined image urls to the placeholder
const safeImage = (item: any): string => {
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0].url
  } else {
    return "/img/unavailable.png"
  }
}

/**
 * https://developer.spotify.com/console/get-current-user/
 *
 * @param {string} accessToken
 * @return {User} user
 */
export async function getCurrentUser(accessToken: string): Promise<User> {
  let res
  res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  res = await res.json()
  return {
    name: res.display_name,
    id: res.id,
    externalURL: res.external_urls.spotify,
    imageURL: safeImage(res),
  }
}
/**
 * https://developer.spotify.com/console/get-users-profile/
 *
 * @param {string} accessToken
 * @param {string} userID
 * @return {User} user
 */
export async function getUser(accessToken: string, userID: string): Promise<User> {
  let res
  res = await fetch("https://api.spotify.com/v1/users/" + userID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  res = await res.json()

  return {
    name: res.display_name,
    id: res.id,
    externalURL: res.external_urls.spotify,
    imageURL: safeImage(res),
  }
}

/**
 * Get the currently playing track.
 * @link https://developer.spotify.com/console/get-users-currently-playing-track/
 *
 * @param {string} accessToken
 */
export async function getCurrentlyPlayingTrack(accessToken: string): Promise<TrackInfo | null> {
  let res
  res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (res.status === 204) {
    return null // nothing is playing
  } else {
    res = await res.json()
    if (res.error) {
      throw new Error(res.error.status + ": " + res.error.message)
    }
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
    }
  }
}

/**
 * Get a track information.
 * @link https://developer.spotify.com/console/get-track/
 *
 * @param {string} accessToken
 * @param {string} trackID
 */
export async function getTrack(accessToken: string, trackID: string): Promise<TrackInfo> {
  let res
  res = await fetch("https://api.spotify.com/v1/tracks/" + trackID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  res = await res.json()

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
  }
}

/**
 * Get playlists of the bearer of access token.
 * @link https://developer.spotify.com/console/get-current-user-playlists/
 *
 * @param {string} accessToken
 */
export async function getCurrentUserPlaylists(accessToken: string): Promise<PlaylistInfo[]> {
  let playlists: PlaylistInfo[] = []
  let nextURL: string | null =
    "https://api.spotify.com/v1/me/playlists?fields=items(id,name,tracks(total),href,images)&limit=50"
  let res
  do {
    res = await fetch(nextURL!, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res = await res.json()
    playlists = playlists.concat(
      res.items.map((i: any) => {
        return {
          name: i.name,
          numTracks: i.tracks.total,
          href: i.href,
          playlistCover: safeImage(i),
          id: i.id,
        }
      })
    )
    nextURL = res.next
  } while (nextURL)

  return playlists
}

/**
 * Gets the playlists of a user.
 * @link https://developer.spotify.com/console/get-playlists/
 *
 * @param {string} accessToken
 * @param {string} userID
 */
export async function getUserPlaylists(accessToken: string, userID: string): Promise<PlaylistInfo[]> {
  let playlists: PlaylistInfo[] = []
  let nextURL: string | null =
    "https://api.spotify.com/v1/users/" + userID + "/playlists?fields=items(id,name,tracks(total),href,images)&limit=50"
  let res
  do {
    res = await fetch(nextURL!, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res = await res.json()
    playlists = playlists.concat(
      res.items.map((i: any) => {
        return {
          name: i.name,
          numTracks: i.tracks.total,
          href: i.href,
          playlistCover: safeImage(i),
          id: i.id,
        }
      })
    )
    nextURL = res.next
  } while (nextURL)

  return playlists
}

/**
 * Retrieves all track IDs in a playlist. This is done for performance reasons.
 * @link https://developer.spotify.com/console/get-playlist-tracks/
 * @see getTrackShortInfosInPlaylist for more detailed track retrieval.
 *
 * @param {string} accessToken
 * @param {string} playlistID
 */
export async function getTrackIDsInPlaylist(accessToken: string, playlistID: string): Promise<string[]> {
  let trackIDs: string[] = []
  let nextURL: string | null =
    "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks?fields=next,items(track(id))&limit=50"
  do {
    let res
    res = await fetch(nextURL!, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res = await res.json()
    trackIDs = trackIDs.concat(res.items.map((i: any) => i.track.id))

    nextURL = res.next
  } while (nextURL)

  return trackIDs
}

/**
 * https://developer.spotify.com/console/get-playlist-tracks/
 *
 * Retrieves all tracks in a playlist.
 *
 * @param {string} accessToken
 * @param {string} playlistID
 */
export async function getTrackShortInfosInPlaylist(accessToken: string, playlistID: string): Promise<ShortTrackInfo[]> {
  let trackInfos: ShortTrackInfo[] = []
  let nextURL: string | null =
    "https://api.spotify.com/v1/playlists/" +
    playlistID +
    "/tracks?fields=next,items(track(id,name,album(name),artists(name)))&limit=50"
  do {
    let res
    res = await fetch(nextURL!, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    res = await res.json()

    trackInfos = trackInfos.concat(
      res.items.map((t: any) => {
        return {
          name: t.track.name,
          id: t.track.id,
          artistName: t.track.artists[0].name,
          albumName: t.track.album.name,
        }
      })
    )

    nextURL = res.next
  } while (nextURL)
  return trackInfos
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features
 *
 * Retrieves the audio features of a given track.
 *
 * @param {string} accessToken
 * @param {string} trackID
 */
export async function getTrackAudioFeatures(accessToken: string, trackID: string): Promise<TrackAudioFeatures> {
  let res
  res = await fetch("https://api.spotify.com/v1/audio-features/" + trackID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  res = await res.json()

  return {
    trackID: trackID,
    acousticness: res.acousticness,
    danceability: res.danceability,
    energy: res.energy,
    instrumentalness: res.instrumentalness,
    key: res.key, // C=0, C#=1, D=2, ...
    liveness: res.liveness,
    loudness: res.loudness,
    speechiness: res.speechiness,
    valence: res.valence,
  }
}
