import { Table, Grid, Text, Select, TextInput, ScrollArea, Title } from "@mantine/core"
import { useEffect, useState } from "react"
import { PlaylistInfo, ShortTrackInfo, User } from "../types/spotify"
import * as spotify from "../api/spotify"
import { useSessionContext } from "../context/session"

const DEFAULT_USER_URL: string = "https://open.spotify.com/user/erhany?si=c35f51c79ee14791"

const SpotiDiff = () => {
  const { session } = useSessionContext()
  // user A
  const [userA, setUserA] = useState<User | undefined>(undefined)
  const [userAURL, setUserAURL] = useState(DEFAULT_USER_URL)
  const [userAURLError, setUserAURLError] = useState("")
  const [userAPlaylists, setUserAPlaylists] = useState<PlaylistInfo[] | undefined>(undefined)
  const [userAPlaylistID, setUserAPlaylistID] = useState("")
  const [userATracks, setUserATracks] = useState<ShortTrackInfo[] | undefined>(undefined)
  // user B
  const [userB, setUserB] = useState<User | undefined>(undefined)
  const [userBURL, setUserBURL] = useState(DEFAULT_USER_URL)
  const [userBURLError, setUserBURLError] = useState("")
  const [userBPlaylists, setUserBPlaylists] = useState<PlaylistInfo[] | undefined>(undefined)
  const [userBPlaylistID, setUserBPlaylistID] = useState("")
  const [userBTracks, setUserBTracks] = useState<ShortTrackInfo[] | undefined>(undefined)
  // both
  const [matchedTrackIDs, setMatchedTrackIDs] = useState<string[] | undefined>(undefined)

  function TracksTable(tracks: ShortTrackInfo[]) {
    return (
      <ScrollArea sx={{ height: "500px" }}>
        <Table verticalSpacing="xs" fontSize="xs">
          <thead>
            <tr>
              <th>Track</th>
              <th>Artist</th>
              <th>Album</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((t, i) => {
              let style = undefined
              if (matchedTrackIDs!.includes(t.id)) {
                style = { backgroundColor: "lightgreen", fontWeight: "bold" }
              }
              return (
                <tr key={i} style={style}>
                  <td>{t.name}</td>
                  <td>{t.artistName}</td>
                  <td>{t.albumName}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </ScrollArea>
    )
  }
  // update user A
  useEffect(() => {
    const USER_URL_REGEX: RegExp = new RegExp(
      /^https:\/\/open.spotify.com\/user\/[0-9a-zA-Z]+\?si=[0-9a-zA-Z]{16}$/,
      "gs"
    )
    if (USER_URL_REGEX.test(userAURL)) {
      setUserAURLError("")
      const userID: string = userAURL.split("?")[0].split("/").at(-1)!
      spotify.getUser(session.authInfo!.accessToken, userID).then((u) => setUserA(u))
    } else {
      setUserAURLError("Invalid Spotify Profile URL")
    }
  }, [userAURL])

  // update user B
  useEffect(() => {
    const USER_URL_REGEX: RegExp = new RegExp(
      /^https:\/\/open.spotify.com\/user\/[0-9a-zA-Z]+\?si=[0-9a-zA-Z]{16}$/,
      "gs"
    )
    if (USER_URL_REGEX.test(userBURL)) {
      setUserBURLError("")
      const userID: string = userBURL.split("?")[0].split("/").at(-1)!
      spotify.getUser(session.authInfo!.accessToken, userID).then((u) => setUserB(u))
    } else {
      setUserBURLError("Invalid Spotify Profile URL")
    }
  }, [userBURL])

  // update user A playlists
  useEffect(() => {
    if (userA) {
      spotify.getUserPlaylists(session.authInfo!.accessToken, userA.id).then((pls) => setUserAPlaylists(pls))
    }
  }, [userA])

  // update user B playlists
  useEffect(() => {
    if (userB) {
      spotify.getUserPlaylists(session.authInfo!.accessToken, userB.id).then((pls) => setUserBPlaylists(pls))
    }
  }, [userB])

  // update user A playlist tracks
  useEffect(() => {
    if (userAPlaylistID !== "") {
      spotify
        .getTrackShortInfosInPlaylist(session.authInfo!.accessToken, userAPlaylistID)
        .then((ts) => setUserATracks(ts))
    }
  }, [userAPlaylistID])

  // update user B playlist tracks
  useEffect(() => {
    if (userBPlaylistID !== "") {
      spotify
        .getTrackShortInfosInPlaylist(session.authInfo!.accessToken, userBPlaylistID)
        .then((ts) => setUserBTracks(ts))
    }
  }, [userBPlaylistID])

  // find matches between tracks
  useEffect(() => {
    if (userATracks && userBTracks) {
      const matchedIDs: string[] = []
      // both lists exist, find matches
      for (let i = 0; i < userATracks.length; ++i) {
        for (let j = 0; j < userBTracks.length; ++j) {
          if (userATracks[i].id === userBTracks[j].id) {
            matchedIDs.push(userATracks[i].id)
          }
        }
      }

      setMatchedTrackIDs(matchedIDs)
    }
  }, [userATracks, userBTracks])

  return (
    <>
      <Title>SpotiDiff</Title>
      <Text mb="md">Compare playlists of two users.</Text>

      <Grid>
        {/* 1st row - User URL Inputs */}
        <Grid.Col xs={6}>
          <TextInput
            placeholder={DEFAULT_USER_URL}
            label="Spotify Profile URL of First User"
            onChange={(e) => {
              setUserAURL(e.target.value)
            }}
            error={userAURLError}
            value={userAURL}
            required
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <TextInput
            placeholder={DEFAULT_USER_URL}
            label="Spotify Profile URL of Second User"
            onChange={(e) => {
              setUserBURL(e.target.value)
            }}
            error={userBURLError}
            value={userBURL}
            required
          />
        </Grid.Col>

        {/* 2nd row - Playlist Selection */}
        <Grid.Col xs={6}>
          <Select
            label="Select Playlist of First User"
            disabled={!userAPlaylists}
            placeholder="Pick one"
            data={
              userAPlaylists
                ? userAPlaylists.map((pl) => {
                    return {
                      value: pl.id,
                      label: pl.name,
                    }
                  })
                : []
            }
            onChange={(val) => val && setUserAPlaylistID(val)}
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <Select
            label="Select Playlist of Second User"
            placeholder="Pick one"
            disabled={!userBPlaylists}
            data={
              userBPlaylists
                ? userBPlaylists.map((pl) => {
                    return {
                      value: pl.id,
                      label: pl.name,
                    }
                  })
                : []
            }
            onChange={(val) => val && setUserBPlaylistID(val)}
          />
        </Grid.Col>

        {/* 3rd row - Tracks */}
        <Grid.Col xs={6}>
          {userATracks && matchedTrackIDs && (
            <>
              <Text color="dimmed">First User's Tracks</Text>
              {TracksTable(userATracks)}
            </>
          )}
        </Grid.Col>
        <Grid.Col xs={6}>
          {userBTracks && matchedTrackIDs && (
            <>
              <Text color="dimmed">Second User's Tracks</Text>
              {TracksTable(userBTracks)}
            </>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}

export default SpotiDiff
