import React, { useContext, useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import * as spotify from "./api/spotify";
import { AuthInfo, AuthContext } from "./context/auth";

function Item({ text }: { text: string }) {
  return <div style={{ textAlign: "center", backgroundColor: "lightblue" }}>{text}</div>;
}

export default function SpotiDiff() {
  const { authInfo } = useContext(AuthContext);
  // my playlists, the selected one and its tracks
  const [myPlaylists, setMyPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [mySelectedPlaylistValue, setMySelectedPlaylistValue] = useState("");
  const handleMyPlaylistChange = (e: SelectChangeEvent) => setMySelectedPlaylistValue(e.target.value);

  // pair user
  const [targetPairID, setTargetPairID] = useState("");
  const [pair, setPair] = useState<spotify.User>(null);
  const handleAddPair = () => {
    spotify.getUser(authInfo!.accessToken, targetPairID).then((user) => setPair(user));
  };
  const handleRemovePair = () => setPair(null);

  // pair user's playlists
  const [pairPlaylists, setPairPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [pairSelectedPlaylistValue, setPairSelectedPlaylistValue] = useState("");
  const handlePairPlaylistChange = (e: SelectChangeEvent) => setPairSelectedPlaylistValue(e.target.value);

  useEffect(() => {
    if (pair) {
      // a new pair is loaded, load their playlists
      spotify.getUserPlaylists(authInfo.accessToken, pair.id).then((pls) => {
        console.log("Pair pls:", pls);
        setPairPlaylists(pls);
      });
    }
  }, [pair]);

  // compoundDidMount
  useEffect(() => {
    spotify.getCurrentUserPlaylists(authInfo.accessToken).then((pls) => setMyPlaylists(pls));
  }, []);

  return (
    <Container>
      <Grid container>
        {/* Current user */}
        <Grid item xs={6}>
          <Button variant="contained" disabled color="primary" sx={{ width: "100%", height: "100%" }}>
            Me
          </Button>
        </Grid>
        {/* Target user */}
        <Grid item xs={6}>
          {pair ? (
            <>
              <Typography
                variant="h5"
                component="a"
                style={{ textDecoration: "none", color: "inherit", width: "80%", height: "100%" }}
              >
                {pair.name}
              </Typography>
              <Button
                variant="contained"
                onClick={handleRemovePair}
                color="secondary"
                sx={{ width: "20%", height: "100%" }}
              >
                <PersonRemoveIcon />
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Spotify Username"
                variant="outlined"
                color="primary"
                sx={{ width: "80%", height: "100%" }}
                onChange={(e) => {
                  setTargetPairID(e.target.value);
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddPair}
                color="secondary"
                sx={{ width: "20%", height: "100%" }}
              >
                <PersonAddIcon />
              </Button>
            </>
          )}
        </Grid>
        {/* My playlists */}
        <Grid item xs={6}>
          {myPlaylists ? (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select Playlist</InputLabel>
              <Select
                labelId="myplaylist-select"
                id="myplaylist-select"
                value={mySelectedPlaylistValue}
                label="Select Playlist"
                onChange={handleMyPlaylistChange}
              >
                {myPlaylists.map((pl, i) => {
                  return (
                    <MenuItem key={i} value={i}>
                      {pl!.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : (
            <></>
          )}
        </Grid>
        {/* Their playlists */}
        <Grid item xs={6}>
          {pairPlaylists ? (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select Playlist</InputLabel>
              <Select
                labelId="pairplaylist-select"
                id="pairplaylist-select"
                value={pairSelectedPlaylistValue}
                label="Select Playlist"
                onChange={handlePairPlaylistChange}
              >
                {pairPlaylists.map((pl, i) => {
                  return (
                    <MenuItem key={i} value={i}>
                      {pl!.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : (
            <></>
          )}
        </Grid>
        {/* Songs in my playlist */}
        <Grid item xs={6}>
          333
        </Grid>
        {/* Songs in their playlist */}
        <Grid item xs={6}>
          444
        </Grid>
      </Grid>
    </Container>
  );
}
