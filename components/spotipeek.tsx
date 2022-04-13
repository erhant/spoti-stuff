import { Skeleton, Center, Stack, Title, Text, Grid } from "@mantine/core"
import { useEffect, useState } from "react"
import { TrackAudioFeatures, TrackInfo } from "../types/spotify"
import spotify from "../api/spotify"
import TrackAudioFeaturesView from "./track-audio-features-view"
import TrackView from "./track-view"
import { useSessionContext } from "../context/session"
import { useErrorHandler } from "react-error-boundary"
import Head from "next/head"

const SpotiPeek = () => {
  const [track, setTrack] = useState<TrackInfo | undefined | null>(undefined)
  const [taf, setTaf] = useState<TrackAudioFeatures | undefined>(undefined)

  useEffect(() => {
    spotify.getCurrentlyPlayingTrack().then((t) => setTrack(t))
  }, [])

  useEffect(() => {
    if (track) spotify.getTrackAudioFeatures(track.id).then((taf) => setTaf(taf))
  }, [track])

  /**
   * Show the current playing track. Displays an info text if no track is playing.
   */
  function showTrack() {
    if (track === undefined) return <Skeleton />
    if (track === null) return <Title>No track is playing.</Title>
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
    <>
      <Head>
        <title>SpotiPeek</title>
      </Head>
      <Title>SpotiPeek</Title>
      <Text mb="md">See which song you are currently playing, and peek at it&apos;s audio features.</Text>
      <Grid align="center" justify="center">
        <Grid.Col xs={12} sm={6}>
          {showTrack()}
        </Grid.Col>
        <Grid.Col xs={12} sm={6}>
          {showTrackFeatures()}
        </Grid.Col>
      </Grid>
    </>
  )
}

export default SpotiPeek
