import React, { useState, useContext } from "react";
import { Container, LinearProgress, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles/SpotiFind.module.scss";
import * as spotify from "./api/spotify";
import { TrackInfo, PlaylistInfo } from "./types/spotify";
import { AuthContext } from "./context/auth";

const DEFAULT_SONGLINK: string = "https://open.spotify.com/track/56ludMgW4hyQhH6xqzypdO?si=9883047ae8424740";
const SONGLINK_REGEX: RegExp = new RegExp(
  /^https:\/\/open.spotify.com\/track\/[0-9a-zA-Z]{22}\?si=[0-9a-zA-Z]{16}$/,
  "gs"
);

type ProgressState = {
  numPlaylists: number;
  donePlaylists: number;
  currentPlaylist: PlaylistInfo;
};

export default function SpotiFind() {
  const { authInfo } = useContext(AuthContext);
  const [trackText, setTrackText] = useState<string>(DEFAULT_SONGLINK);
  const [trackTextError, setTrackTextError] = useState("");
  const [progressState, setProgressState] = useState<ProgressState | null>(null);
  const [trackState, setTrackState] = useState<TrackInfo | null>(null);
  const [matchesState, setMatchesState] = useState<PlaylistInfo[] | null>(null);

  /**
 * Find if a track exists in any of the user's playlists.
 * Updates the trackState and progressState to show progress.

 * @param {string} accessToken
 * @param {string} targetTrackID
 */
  async function findTrackInUserPlaylists(accessToken: string, targetTrackID: string): Promise<PlaylistInfo[]> {
    // get track info
    const trackInfo: TrackInfo = await spotify.getTrack(accessToken, targetTrackID);
    // update model track
    setTrackState(trackInfo);
    // console.log("Searching for", trackInfo);

    const playlists = await spotify.getCurrentUserPlaylists(accessToken);
    // console.log(playlists);

    // search the track in eachplaylist
    const matchedPlaylists: PlaylistInfo[] = [];
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
