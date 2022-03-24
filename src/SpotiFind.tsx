import React, { useState, useContext } from "react";
import { Container, LinearProgress, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles/SpotiFind.module.scss";
import * as spotify from "./api/spotify";
import { AuthContext } from "./context/auth";

export default function SpotiFind() {
  const { authInfo } = useContext(AuthContext);
  const [progressState, setProgressState] = useState<spotify.ProgressState>(null);
  const [trackState, setTrackState] = useState<spotify.TrackInfo>(null);
  const [matchesState, setMatchesState] = useState<spotify.PlaylistInfo[] | null>(null);
  const handleSearchClick = () => {
    setProgressState(null);
    setTrackState(null);
    setMatchesState(null);
    spotify
      .findTrackInUserPlaylists(
        authInfo.accessToken,
        "https://open.spotify.com/track/4JW2yU9lIb8jCNv47PpTfZ?si=3105a22549e14f88",
        setProgressState,
        setTrackState
      )
      .then((matches) => setMatchesState(matches));
  };

  return (
    <Container className={styles.container}>
      {matchesState ? (
        <div style={{ textAlign: "left" }}>
          {matchesState.length === 0 ? (
            <h1>You do not have this song added.</h1>
          ) : (
            <div>
              <h2>This song is in {matchesState.length} lists:</h2>
              {matchesState.map((match, i) => {
                return (
                  <div key={i}>
                    <img
                      src={match!.playlistCover}
                      className={styles.playlistImage}
                      style={{ float: "left", marginRight: "1em" }}
                    ></img>
                    <h2>{match!.name} </h2>
                  </div>
                );
              })}
              ;
            </div>
          )}
        </div>
      ) : progressState ? (
        <div>
          <LinearProgress className={styles.progress} />
          <h2>Searching playlist: {progressState.currentPlaylist!.name} </h2>
          <img className={styles.playlistImage} src={progressState.currentPlaylist!.playlistCover} />
          <h2>
            Target track: {trackState!.name} - {trackState!.artistName}
          </h2>
          <img className={styles.trackImage} src={trackState!.albumCover} />
        </div>
      ) : (
        <div>
          <TextField label="Song Link" variant="outlined" color="primary" sx={{ width: "100%" }} />
          <Button
            className={styles.searchButton}
            variant="outlined"
            endIcon={<SearchIcon />}
            onClick={handleSearchClick}
          >
            Find
          </Button>
        </div>
      )}
    </Container>
  );
}
