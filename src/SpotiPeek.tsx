import React, { useEffect, useState, useContext } from "react";
import { Container, LinearProgress } from "@mui/material";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import styles from "./styles/SpotiPeek.module.scss";
import * as spotify from "./api/spotify";
import { AuthContext } from "./context/auth";

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
      console.log("Track features:", features);
      if (!active) return;

      setLoading(false);
      setPlayingTrack(track);
      setTrackFeatures(features);
    }
  }, []);

  return (
    <Container className={styles.container}>
      {loading ? (
        <>
          <h1>Retrieving track information...</h1>
          <LinearProgress className={styles.progress} />
        </>
      ) : playingTrack ? (
        <>
          <h1>You are currently listening to:</h1>
          <img src={playingTrack.album.imageURL} className={styles.albumImage} />
          <h2>{playingTrack.name}</h2>
          <h3>{playingTrack.artist.name}</h3>
          {trackFeatures ? (
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
                  meta: { color: "green" },
                },
              ]}
              size={400}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <h1>Nothing is playing right now.</h1>
      )}
    </Container>
  );
}
