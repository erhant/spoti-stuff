import React, { useState, useContext } from "react";
import { Container, LinearProgress, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles/SpotiFind.module.scss";
import * as spotify from "./api/spotify";
import { AuthContext } from "./context/auth";

const DEFAULT_SONGLINK: string = "https://open.spotify.com/track/56ludMgW4hyQhH6xqzypdO?si=9883047ae8424740";
const SONGLINK_REGEX: RegExp = new RegExp(
  /^https:\/\/open.spotify.com\/track\/[0-9a-zA-Z]{22}\?si=[0-9a-zA-Z]{16}$/,
  "gs"
);

export default function SpotiFind() {
  const { authInfo } = useContext(AuthContext);
  const [trackText, setTrackText] = useState<string>(DEFAULT_SONGLINK);
  const [trackTextError, setTrackTextError] = useState<string>("");
  const [progressState, setProgressState] = useState<spotify.ProgressState>(null);
  const [trackState, setTrackState] = useState<spotify.TrackInfo>(null);
  const [matchesState, setMatchesState] = useState<spotify.PlaylistInfo[] | null>(null);
  const handleSearchClick = () => {
    if (!SONGLINK_REGEX.test(trackText)) {
      setTrackTextError("Your input is not a Spotify song link URL!");
      return;
    }

    setProgressState(null);
    setTrackState(null);
    setMatchesState(null);
    spotify
      .findTrackInUserPlaylists(authInfo.accessToken, trackText, setProgressState, setTrackState)
      .then((matches) => setMatchesState(matches));
  };

  return (
    <Container className={styles.container}>
      {matchesState ? (
        <div style={{ textAlign: "left" }}>
          {matchesState.length === 0 ? (
            <h1>You do not have this song added.</h1>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : progressState ? (
        <>
          <LinearProgress className={styles.progress} />
          <h2>Searching playlist: {progressState.currentPlaylist!.name} </h2>
          <img className={styles.playlistImage} src={progressState.currentPlaylist!.playlistCover} />
          <h2>
            Target track: {trackState!.name} - {trackState!.artist.name}
          </h2>
          <img className={styles.trackImage} src={trackState!.album.imageURL} />
        </>
      ) : (
        <>
          <h1>Please enter the song link you would like to search.</h1>
          <TextField
            label="Song Link"
            variant="outlined"
            color="primary"
            sx={{ width: "100%" }}
            defaultValue={DEFAULT_SONGLINK}
            error={trackTextError !== ""}
            helperText={trackTextError}
            onChange={(e) => {
              setTrackText(e.target.value);
            }}
          />
          <Button
            variant="outlined"
            size="large"
            endIcon={<SearchIcon />}
            onClick={handleSearchClick}
            sx={{ marginTop: "2em" }}
          >
            Find
          </Button>
        </>
      )}
    </Container>
  );
}
