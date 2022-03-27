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
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
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

const DEFAULT_PAIRLINK: string = "https://open.spotify.com/user/erhany?si=7b0cebf257c34ce8";
const PAIRLINK_REGEX: RegExp = new RegExp(/^https:\/\/open.spotify.com\/user\/[0-9a-zA-Z]+\?si=[0-9a-zA-Z]{16}$/, "gs");

// Type for tracks, match is true if tracks exists on both sides
type ShortInfoWithMatch = spotify.ShortTrackInfo & { match?: boolean };

export default function SpotiDiff() {
  const { authInfo } = useContext(AuthContext);
  // my playlists, the selected one and its tracks
  const [myPlaylists, setMyPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [mySelectedPlaylistValue, setMySelectedPlaylistValue] = useState("");
  const [myPlaylistTracks, setMyPlaylistTracks] = useState<ShortInfoWithMatch[]>([]);
  const handleMyPlaylistChange = (e: SelectChangeEvent) => setMySelectedPlaylistValue(e.target.value);

  // pair user
  const [targetPairText, setTargetPairText] = useState(DEFAULT_PAIRLINK);
  const [targetPairTextTextError, setTargetPairTextError] = useState("");
  const [pair, setPair] = useState<spotify.User>(null);
  const handleAddPair = () => {
    if (!PAIRLINK_REGEX.test(targetPairText)) {
      setTargetPairTextError("Your input is not a Spotify profile URL!");
      return;
    }
    setTargetPairTextError("");

    // parse track string to obtain track id, it is the string between furthest '/' and the '?'
    const pairID: string = targetPairText.split("?")[0].split("/").at(-1)!;
    spotify.getUser(authInfo!.accessToken, pairID).then((user) => setPair(user));
  };
  const handleRemovePair = () => setPair(null);

  // pair user's playlists
  const [pairPlaylists, setPairPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [pairSelectedPlaylistValue, setPairSelectedPlaylistValue] = useState("");
  const [pairPlaylistTracks, setPairPlaylistTracks] = useState<ShortInfoWithMatch[]>([]);
  const handlePairPlaylistChange = (e: SelectChangeEvent) => setPairSelectedPlaylistValue(e.target.value);

  const [loadingTracks, setLoadingTracks] = useState(true);

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

  function TracksTable({ tracks }: { tracks: ShortInfoWithMatch[] }) {
    if (tracks.length === 0) return <></>;
    if (loadingTracks)
      return (
        <Stack spacing={1}>
          <Skeleton variant="rectangular" width="100%" height="2em" />
          <Skeleton variant="rectangular" width="100%" height="2em" />
          <Skeleton variant="rectangular" width="100%" height="2em" />
        </Stack>
      );
    else
      return (
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {["Match", "Name", "Artist", "Album"].map((s: string, i) => (
                  <TableCell key={i}>{s}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.map((track, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {track.match ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>{track.name}</TableCell>
                  <TableCell>{track.artistName}</TableCell>
                  <TableCell>{track.albumName}</TableCell>
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
      spotify.getUserPlaylists(authInfo.accessToken, pair.id).then((pls) => setPairPlaylists(pls));
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

  useEffect(() => {
    if (myPlaylistTracks.length > 0 && pairPlaylistTracks.length > 0) {
      const myTrackIDS = myPlaylistTracks.map((t: any) => t.id);
      const pairTrackIDS = pairPlaylistTracks.map((t: any) => t.id);
      // mark the intersecting arrays as matched
      let i;
      let j;
      for (i = 0; i < myTrackIDS.length; ++i) {
        j = pairTrackIDS.indexOf(myTrackIDS[i]);
        if (j !== -1) {
          myPlaylistTracks[i].match = true;
          pairPlaylistTracks[j].match = true;
        }
      }
      setLoadingTracks(false);
    }
  }, [myPlaylistTracks, pairPlaylistTracks]);

  // compoundDidMount
  useEffect(() => {
    spotify.getCurrentUserPlaylists(authInfo.accessToken).then((pls) => setMyPlaylists(pls));
  }, []);

  return (
    <Container>
      <Grid container rowGap="1em" columnGap="0.5em" sx={{ flexGrow: 1 }}>
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
                value={targetPairText}
                sx={{ width: "80%", height: "100%" }}
                error={targetPairTextTextError !== ""}
                helperText={targetPairTextTextError}
                onChange={(e) => {
                  setTargetPairText(e.target.value);
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
