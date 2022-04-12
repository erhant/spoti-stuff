import { Group, Skeleton, Box, Text, Grid, Stack } from "@mantine/core"
import { useEffect, useState } from "react"
import { TrackAudioFeatures, TrackInfo } from "../types/spotify"
import * as spotify from "../api/spotify"
import TrackAudioFeaturesView from "./track-audio-features-view"
import TrackView from "./track-view"
import { useSessionContext } from "../context/session"
import { useErrorHandler } from "react-error-boundary"

const SpotiPeek = () => {
  const [track, setTrack] = useState<TrackInfo | undefined | null>(undefined)
  const [taf, setTaf] = useState<TrackAudioFeatures | undefined>(undefined)
  const { session } = useSessionContext()
  const handleError = useErrorHandler()

  useEffect(() => {
    if (session.authInfo) {
      spotify.getCurrentlyPlayingTrack(session.authInfo.accessToken).then((t) => setTrack(t), handleError)
    }
  }, [])

  useEffect(() => {
    if (track)
      spotify.getTrackAudioFeatures(session.authInfo!.accessToken, track.id).then((taf) => setTaf(taf), handleError)
  }, [track])

  /**
   * Show the current playing track. Displays an info text if no track is playing.
   */
  function showTrack() {
    if (track === undefined) return <Skeleton />
    if (track === null) return <Text>No track is playing.</Text>
    return <TrackView track={track} />
  }

  /**
   * Shows track features.
   */
  function showTrackFeatures() {
    if (taf) {
      return <TrackAudioFeaturesView taf={taf} />
    } else {
      return <Skeleton />
    }
  }
  return (
    <Grid>
      <Grid.Col xs={12} sm={6}>
        {showTrack()}
      </Grid.Col>
      <Grid.Col xs={12} sm={6}>
        {showTrackFeatures()}
      </Grid.Col>
    </Grid>
  )
}

export default SpotiPeek
