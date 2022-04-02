import React, { useEffect, useState, useContext } from "react";
import { Container, LinearProgress, Grid } from "@mui/material";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import styles from "./style.module.scss";
import * as spotify from "../../api/spotify";
import { AuthContext } from "../../context/auth";
import TrackView from "../trackview";

export default function SpotiPeek() {
  const { authInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [playingTrack, setPlayingTrack] = useState<spotify.TrackInfo | null>(null);
  const [trackFeatures, setTrackFeatures] = useState<spotify.TrackAudioFeatures | null>(null);

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const track = await spotify.getCurrentlyPlayingTrack(authInfo.accessToken);
      const features = await spotify.getTrackAudioFeatures(authInfo.accessToken, track.id);

      if (!active) return;

      setLoading(false);
      setPlayingTrack(track);
      setTrackFeatures(features);
    }
  }, []);

  function LoadingScreen() {
    return (
      <>
        <h1>Retrieving track information...</h1>
        <LinearProgress className={styles.progress} />
      </>
    );
  }

  function TrackFeaturesChart({ trackFeatures }: { trackFeatures: spotify.TrackAudioFeatures }) {
    return (
      <RadarChart
        captions={{
          acousticness: "Acoustic",
          danceability: "Danceable",
          energy: "Energic",
          instrumentalness: "Instrumental",
          liveness: "Live",
          speechiness: "Speech",
          valence: "Positiveness",
        }}
        data={[
          {
            data: {
              acousticness: trackFeatures.acousticness,
              danceability: trackFeatures.danceability,
              energy: trackFeatures.energy,
              instrumentalness: trackFeatures.instrumentalness,
              liveness: trackFeatures.liveness,
              speechiness: trackFeatures.speechiness,
              valence: trackFeatures.valence,
            },
            meta: { color: "#038b32" },
          },
        ]}
        size={400}
      />
    );
  }
  return (
    <Container className={styles.container}>
      <Grid container justifyContent="center">
        {loading ? (
          <Grid item xs={12}>
            <LoadingScreen />
          </Grid>
        ) : playingTrack ? (
          <>
            <Grid item xs={6}>
              <TrackView track={playingTrack} />
            </Grid>
            <Grid item xs={6}>
              {trackFeatures && (
                <>
                  <h3>Track Features</h3>
                  <TrackFeaturesChart trackFeatures={trackFeatures} />
                </>
              )}
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <h1>Nothing is playing right now.</h1>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
