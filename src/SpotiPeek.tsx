import React, { useEffect, useState, useContext } from "react";
import { Container, LinearProgress } from "@mui/material";
import styles from "./styles/SpotiPeek.module.scss";
import * as spotify from "./api/spotify";
import { AuthContext } from "./context/auth";

export default function SpotiPeek() {
  const { authInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [playbackState, setPlaybackState] = useState<spotify.PlayingTrack>(null);

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const res = await spotify.getCurrentlyPlayingTrack(authInfo.accessToken);
      if (!active) return;

      setLoading(false);
      setPlaybackState(res);
    }
  }, []);

  return (
    <Container className={styles.container}>
      {loading ? (
        <LinearProgress className={styles.progress} />
      ) : playbackState && playbackState.isPlaying ? (
        <div>
          <h1>You are currently listening to:</h1>
          <img src={playbackState.album.imageURL} className={styles.albumImage} />
          <h2>
            {playbackState.track.name} ({playbackState.album.year})
          </h2>
          <h3>{playbackState.artist.name}</h3>
        </div>
      ) : (
        <h1>Nothing is playing right now.</h1>
      )}
    </Container>
  );
}
