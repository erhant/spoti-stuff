import { Grid, TextInput, Button, Progress, Text, Title } from "@mantine/core"
import { useState } from "react"
import { PlaylistInfo, TrackInfo } from "../types/spotify"
import * as spotify from "../api/spotify"
import { useSessionContext } from "../context/session"
import PlaylistView from "./playlist-view"
import TrackView from "./track-view"
import { Search } from "tabler-icons-react"
import Head from "next/head"

const DEFAULT_TRACK_URL: string = "https://open.spotify.com/track/2BcvvHttiZRvguFM4hR398?si=5357b1cf356f4cf8"
const TRACK_URL_REGEX: RegExp = new RegExp(
  /^https:\/\/open.spotify.com\/track\/[0-9a-zA-Z]{22}\?si=[0-9a-zA-Z]{16}$/,
  "gs"
)
const DEFAULT_USER_URL: string = "https://open.spotify.com/user/erhany?si=c35f51c79ee14791"
const USER_URL_REGEX: RegExp = new RegExp(/^https:\/\/open.spotify.com\/user\/[0-9a-zA-Z]+\?si=[0-9a-zA-Z]{16}$/, "gs")

const SpotiFind = () => {
  const { session } = useSessionContext()
  // user URL states
  const [userURL, setUserURL] = useState(DEFAULT_USER_URL)
  const [userURLError, setUserURLError] = useState("")
  // track URL states
  const [trackURL, setTrackURL] = useState(DEFAULT_TRACK_URL)
  const [trackURLError, setTrackURLError] = useState("")
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | undefined>(undefined)
  // search results
  const [foundPlaylists, setFoundPlaylists] = useState<PlaylistInfo[] | undefined>(undefined)
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistInfo | undefined>(undefined)
  const [searchedTrackPercentage, setSearchedTrackPercentage] = useState(0)
  const [searchStatus, setSearchStatus] = useState<"init" | "ongoing" | "done">("init")

  /**
   * Search if a given track exists in any of the playlists of the given user.
   *
   * @param {string} trackURL - Spotify URL of the searched track.
   * @param {string} userURL - Spotify URL of the target profile.
   */
  async function search(trackURL: string, userURL: string) {
    setSearchStatus("ongoing")
    const trackID: string = trackURL.split("?")[0].split("/").at(-1)!
    const userID: string = userURL.split("?")[0].split("/").at(-1)!
    const matches: PlaylistInfo[] = []

    // show the given track information
    spotify.getTrack(session.authInfo!.accessToken, trackID).then((track) => setCurrentTrack(track))

    // retrieve user playlists
    const playlists: PlaylistInfo[] = await spotify.getUserPlaylists(session.authInfo!.accessToken, userID)
    const totalTrackCount = playlists.reduce<number>((acc, pl) => {
      return acc + pl.numTracks
    }, 0)
    let searchedTrackCount = 0
    // search the track in playlists
    for (let i = 0; i < playlists.length; ++i) {
      const pl: PlaylistInfo = playlists[i]
      setCurrentPlaylist(pl)
      const trackIDs: string[] = await spotify.getTrackIDsInPlaylist(session.authInfo!.accessToken, pl.id)
      if (trackIDs.includes(trackID)) {
        matches.push(pl)
      }
      searchedTrackCount += pl.numTracks
      setSearchedTrackPercentage((searchedTrackCount / totalTrackCount) * 100)
    }

    setFoundPlaylists(matches)
    setSearchStatus("done")
  }

  /**
   * View the currently searched playlist, or the final playlist list
   */
  function showPlaylistResults() {
    if (foundPlaylists) {
      // search is done
      if (foundPlaylists.length > 0) {
        return (
          <>
            <Text>Found this track in {foundPlaylists.length} playlists!</Text>
            {foundPlaylists.map((pl, i) => {
              return <PlaylistView playlist={pl} key={i} height="100px" />
            })}
          </>
        )
      } else {
        return <Text>Could not find this track in any of the playlists!</Text>
      }
    } else {
      // still searching
      if (currentPlaylist) {
        return (
          <>
            <Text>Searching through &quot;{currentPlaylist.name}&quot;</Text>
            <PlaylistView playlist={currentPlaylist} />
          </>
        )
      }
    }
  }

  /**
   * Show the currently being searched track
   */
  function showTrack() {
    if (currentTrack) {
      return (
        <>
          <Text>
            Searching for &quot;{currentTrack.name}&quot; by &quot;{currentTrack.artist.name}&quot;
          </Text>
          <TrackView track={currentTrack} />
        </>
      )
    }
  }

  return (
    <>
      <Head>
        <title>SpotiFind</title>
      </Head>
      <Title>SpotiFind</Title>
      <Text mb="md">Find if a track is added in a user&apos;s playlists.</Text>
      <Grid align="center" justify="center">
        {/* 1st row */}
        <Grid.Col xs={5}>
          <TextInput
            placeholder={DEFAULT_TRACK_URL}
            label="Spotify Track URL"
            onChange={(e) => {
              setTrackURL(e.target.value)
            }}
            error={trackURLError}
            value={trackURL}
            required
          />
        </Grid.Col>
        <Grid.Col xs={5}>
          <TextInput
            placeholder={DEFAULT_USER_URL}
            label="Spotify Profile URL"
            onChange={(e) => {
              setUserURL(e.target.value)
            }}
            error={userURLError}
            value={userURL}
            required
          />
        </Grid.Col>
        <Grid.Col xs={2}>
          <Button
            size="md"
            disabled={searchStatus === "ongoing"}
            onClick={() => {
              if (searchStatus === "init") {
                let problems = false
                // check user
                if (!USER_URL_REGEX.test(userURL)) {
                  setUserURLError("Invalid profile URL")
                  problems = true
                } else {
                  setUserURLError("")
                }
                // check track
                if (!TRACK_URL_REGEX.test(trackURL)) {
                  setTrackURLError("Invalid track URL")
                  problems = true
                } else {
                  setTrackURLError("")
                }
                if (problems) return
                else search(trackURL, userURL)
              } else if (searchStatus === "done") {
                // reset everything
                setCurrentPlaylist(undefined)
                setCurrentTrack(undefined)
                setFoundPlaylists(undefined)
                setSearchStatus("init")
                setSearchedTrackPercentage(0)
              }
            }}
          >
            {searchStatus === "done" ? "Reset" : "Search"}
          </Button>
        </Grid.Col>

        {/* 2nd row */}
        <Grid.Col xs={12}>
          <Progress
            animate={searchStatus !== "done"}
            size="lg"
            value={searchedTrackPercentage}
            label={
              // search did not start
              searchedTrackPercentage === 0
                ? "Start searching!"
                : // search finished
                searchedTrackPercentage === 100
                ? "Done!"
                : // otherwise
                  searchedTrackPercentage.toFixed(2) + "%"
            }
          />
        </Grid.Col>

        {/* 3rd row */}
        <Grid.Col xs={6}>{showTrack()}</Grid.Col>
        <Grid.Col xs={6}>{showPlaylistResults()}</Grid.Col>
      </Grid>
    </>
  )
}

export default SpotiFind
