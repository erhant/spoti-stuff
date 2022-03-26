import React, { useContext, useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
import styles from "./styles/SpotiDiff.module.scss";

function Item({ text }: { text: string }) {
  return <div style={{ textAlign: "center", backgroundColor: "lightblue" }}>{text}</div>;
}

export default function SpotiDiff() {
  const { authInfo } = useContext(AuthContext);
  // my playlists, the selected one and its tracks
  const [myPlaylists, setMyPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [mySelectedPlaylistValue, setMySelectedPlaylistValue] = useState("");
  const [myPlaylistTracks, setMyPlaylistTracks] = useState<spotify.ShortTrackInfo[]>([]);
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
  const [pairPlaylistTracks, setPairPlaylistTracks] = useState<spotify.ShortTrackInfo[]>([]);
  const handlePairPlaylistChange = (e: SelectChangeEvent) => setPairSelectedPlaylistValue(e.target.value);

  function SelectionBox({
    playlists,
    label,
    selection,
    changeHandler,
  }: {
    playlists: spotify.PlaylistInfo[] | null;
    label: string;
    selection: string;
    changeHandler: (e: SelectChangeEvent) => void;
  }) {
    return playlists ? (
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select value={selection} label="Select Playlist" onChange={changeHandler}>
          {playlists.map((pl, i) => {
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
    );
  }

  function TracksTable({ tracks }: { tracks: spotify.ShortTrackInfo[] }) {
    if (tracks.length === 0) return <></>;
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Artist</TableCell>
              <TableCell align="right">Album</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks.map((track, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {track.name}
                </TableCell>
                <TableCell align="right">{track.artistName}</TableCell>
                <TableCell align="right">{track.albumName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // new pair is given
  useEffect(() => {
    if (pair) {
      // a new pair is loaded, load their playlists
      spotify.getUserPlaylists(authInfo.accessToken, pair.id).then((pls) => {
        console.log("Pair pls:", pls);
        setPairPlaylists(pls);
      });
    }
  }, [pair]);

  // update my tracks
  useEffect(() => {
    if (myPlaylists && mySelectedPlaylistValue !== "") {
      const pl: spotify.PlaylistInfo = myPlaylists[parseInt(mySelectedPlaylistValue)];
      spotify.getTrackShortInfosInPlaylist(authInfo.accessToken, pl!.id).then((tinfos) => setMyPlaylistTracks(tinfos));
    }
  }, [mySelectedPlaylistValue]);

  // update pair tracks
  useEffect(() => {
    if (pairPlaylists && pairSelectedPlaylistValue !== "") {
      const pl: spotify.PlaylistInfo = pairPlaylists[parseInt(pairSelectedPlaylistValue)];
      spotify
        .getTrackShortInfosInPlaylist(authInfo.accessToken, pl!.id)
        .then((tinfos) => setPairPlaylistTracks(tinfos));
    }
  }, [pairSelectedPlaylistValue]);

  // compoundDidMount
  useEffect(() => {
    spotify.getCurrentUserPlaylists(authInfo.accessToken).then((pls) => setMyPlaylists(pls));
  }, []);

  return (
    <Container>
      <Grid container rowGap="1em" columnGap="0.5em">
        {/* Current user */}
        <Grid item xs={5}>
          <Button variant="contained" disabled sx={{ width: "100%", height: "100%" }}>
            Me
          </Button>
        </Grid>
        {/* Target user */}
        <Grid item xs={5}>
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
                color="primary"
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
              <Button variant="contained" onClick={handleAddPair} color="primary" sx={{ width: "20%", height: "100%" }}>
                <PersonAddIcon />
              </Button>
            </>
          )}
        </Grid>
        {/* My playlists */}
        <Grid item xs={5}>
          <SelectionBox
            playlists={myPlaylists}
            selection={mySelectedPlaylistValue}
            changeHandler={handleMyPlaylistChange}
            label="Select Playlist"
          />
        </Grid>
        {/* Their playlists */}
        <Grid item xs={5}>
          {pairPlaylists ? (
            <SelectionBox
              playlists={pairPlaylists}
              selection={pairSelectedPlaylistValue}
              changeHandler={handlePairPlaylistChange}
              label="Select Playlist"
            />
          ) : (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Choose a user first.</InputLabel>
              <Select labelId="pairplaylist-select" id="pairplaylist-select" value={""} disabled></Select>
            </FormControl>
          )}
        </Grid>
        {/* Songs in my playlist */}
        <Grid item xs={5}>
          <TracksTable tracks={myPlaylistTracks} />
        </Grid>
        {/* Songs in their playlist */}
        <Grid item xs={5}>
          <TracksTable tracks={pairPlaylistTracks} />
        </Grid>
      </Grid>
    </Container>
  );
}
