import { Button, Grid, TextInput } from "@mantine/core"
import { useState } from "react"
import { PlaylistInfo, User } from "../types/spotify"

const SpotiDiff = () => {
  // user A
  const [userA, setUserA] = useState<User | undefined>(undefined)
  const [userAURL, setUserAURL] = useState("")
  const [userAURLError, setUserAURLError] = useState("")
  const [userAPlaylists, setUserAPlaylists] = useState<PlaylistInfo[] | undefined>(undefined)
  // user B
  const [userB, setUserB] = useState<User | undefined>(undefined)
  const [userBURL, setUserBURL] = useState("")
  const [userBURLError, setUserBURLError] = useState("")
  const [userBPlaylists, setUserBPlaylists] = useState<PlaylistInfo[] | undefined>(undefined)

  return (
    <Grid>
      {/* 1st row */}
      <Grid.Col xs={5}>
        <TextInput label="Spotify Profile URL" required />
      </Grid.Col>
      <Grid.Col xs={5}>
        <TextInput label="Spotify Profile URL" required />
      </Grid.Col>
      <Grid.Col xs={2}>
        <Button>Retrieve Playlists</Button>
      </Grid.Col>

      {/* 2nd row */}
      <Grid.Col xs={6}>
        <TextInput label="Chosen Playlist" />
      </Grid.Col>
      <Grid.Col xs={6}>
        <TextInput label="Chosen Playlist" />
      </Grid.Col>
    </Grid>
  )
}

export default SpotiDiff
