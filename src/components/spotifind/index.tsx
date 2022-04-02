import React, { useState, useContext } from "react";
import { Container, LinearProgress, TextField, Button, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// user imports
import styles from "./style.module.scss";
import * as spotify from "../../api/spotify";
import { AuthContext } from "../../context/auth";
import TrackView from "../trackview";
import PlaylistView from "../playlistview";

const DEFAULT_SONGLINK: string = "https://open.spotify.com/track/2BcvvHttiZRvguFM4hR398?si=5357b1cf356f4cf8";
const SONGLINK_REGEX: RegExp = new RegExp(
  /^https:\/\/open.spotify.com\/track\/[0-9a-zA-Z]{22}\?si=[0-9a-zA-Z]{16}$/,
  "gs"
);

type ProgressState = {
  numPlaylists: number;
  donePlaylists: number;
  currentPlaylist: spotify.PlaylistInfo;
};

export default function SpotiFind() {
  const { authInfo } = useContext(AuthContext);
  const [trackText, setTrackText] = useState<string>(DEFAULT_SONGLINK);
  const [trackTextError, setTrackTextError] = useState("");
  const [progressState, setProgressState] = useState<ProgressState | null>(null);
  const [trackState, setTrackState] = useState<spotify.TrackInfo | null>(null);
  const [matchesState, setMatchesState] = useState<spotify.PlaylistInfo[] | null>(null);

  /**
 * Find if a track exists in any of the user's playlists.
 * Updates the trackState and progressState to show progress.

 * @param {string} accessToken
 * @param {string} targetTrackID
 */
  async function findTrackInUserPlaylists(accessToken: string, targetTrackID: string): Promise<spotify.PlaylistInfo[]> {
    // get track info
    const trackInfo: spotify.TrackInfo = await spotify.getTrack(accessToken, targetTrackID);
    // update model track
    setTrackState(trackInfo);
    // console.log("Searching for", trackInfo);

    const playlists = await spotify.getCurrentUserPlaylists(accessToken);
    // console.log(playlists);

    // search the track in eachplaylist
    const matchedPlaylists: spotify.PlaylistInfo[] = [];
    for (let i = 0; i < playlists.length; ++i) {
      // update model progress
      setProgressState({
        numPlaylists: playlists.length,
        donePlaylists: i + 1,
        currentPlaylist: playlists[i],
      });
      const trackIDs: string[] = await spotify.getTrackIDsInPlaylist(accessToken, playlists[i]!.id);
      if (trackIDs.includes(targetTrackID)) {
        matchedPlaylists.push(playlists[i]);
      }
    }

    return matchedPlaylists;
  }

  const handleSearchClick = () => {
    if (!SONGLINK_REGEX.test(trackText)) {
      setTrackTextError("Your input is not a Spotify song link URL!");
      return;
    }

    setTrackTextError("");
    setProgressState(null);
    setTrackState(null);
    setMatchesState(null);

    // parse track string to obtain track id, it is the string between furthest '/' and the '?'
    const targetTrackID: string = trackText.split("?")[0].split("/").at(-1)!;
    findTrackInUserPlaylists(authInfo.accessToken, targetTrackID).then((matches) => setMatchesState(matches));
  };

  return (
    <Container className={styles.container}>
      <Grid container justifyContent="center">
        {matchesState ? (
          <div style={{ textAlign: "left" }}>
            {matchesState.length === 0 ? (
              <h1>You do not have this song added.</h1>
            ) : (
              <>
                <h2>This song is in {matchesState.length} lists:</h2>
                {matchesState.map((match, i) => {
                  return (
                    <Grid item key={i} xs={4}>
                      <PlaylistView playlist={match} />
                    </Grid>
                  );
                })}
              </>
            )}
          </div>
        ) : progressState ? (
          <>
            <Grid item xs={12}>
              <h1>Searching your playlists...</h1>
              <LinearProgress className={styles.progress} color="secondary" />
            </Grid>
            <Grid item xs={6}>
              <TrackView track={trackState!} />
            </Grid>
            <Grid item xs={6}>
              <PlaylistView playlist={progressState.currentPlaylist} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
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
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
