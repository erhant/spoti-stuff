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

export default function SpotiDiff() {
  const { authInfo } = useContext(AuthContext);

  // my playlists, the selected one and its tracks
  const [myPlaylists, setMyPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [mySelectedPlaylistValue, setMySelectedPlaylistValue] = useState("");
  const [myPlaylistTracks, setMyPlaylistTracks] = useState<spotify.ShortTrackInfo[]>([]);
  const handleMyPlaylistChange = (e: SelectChangeEvent) => {
    if (myPlaylists) setMySelectedPlaylistValue(e.target.value);
  };

  // pair user
  const [targetPairText, setTargetPairText] = useState(DEFAULT_PAIRLINK);
  const [targetPairTextTextError, setTargetPairTextError] = useState("");
  const [pair, setPair] = useState<spotify.User | null>(null);
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
  const handleRemovePair = () => {
    setPairPlaylists(null);
    setPairPlaylistTracks([]);
    setPairSelectedPlaylistValue("");
    setPair(null);
    setTargetPairText(targetPairText);
    setTargetPairTextError("");
  };

  // pair user's playlists
  const [pairPlaylists, setPairPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [pairSelectedPlaylistValue, setPairSelectedPlaylistValue] = useState("");
  const [pairPlaylistTracks, setPairPlaylistTracks] = useState<spotify.ShortTrackInfo[]>([]);
  const handlePairPlaylistChange = (e: SelectChangeEvent) => setPairSelectedPlaylistValue(e.target.value);

  const [matchingTrackIDs, setMatchingTracksIDs] = useState<string[]>([]);

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
        <Select value={selection} onChange={changeHandler} variant="standard">
          {playlists.map((pl: spotify.PlaylistInfo, i: number) => (
            <MenuItem key={i} value={i}>
              {pl.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ) : (
      <Skeleton animation="wave" sx={{ height: "100%" }} />
    );
  }

  function TracksTable({ tracks }: { tracks: spotify.ShortTrackInfo[] }) {
    // no tracks uploaded for this table yet
    if (tracks.length === 0) return <></>;
    // tracks are in, but they are being matched right now
    /* else if (isMatchingTracks)
      return (
        <Stack spacing={1}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </Stack>
      );
    */
    // mathcing is done, tracks are ready!
    else
      return (
        <TableContainer>
          <Table sx={{ maxWidth: "100%" }}>
            <TableHead>
              <TableRow>
                {["Name", "Artist", "Album"].map((s: string, i) => (
                  <TableCell key={i}>{s}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.map((track, i) => (
                <TableRow
                  key={i}
                  className={matchingTrackIDs.includes(track.id) ? styles.matchedRecord : styles.unmatchedRecord}
                >
                  <TableCell size="small">{track.name}</TableCell>
                  <TableCell size="small">{track.artistName}</TableCell>
                  <TableCell size="small">{track.albumName}</TableCell>
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
      console.log(`Selected ${parseInt(mySelectedPlaylistValue)}`, pl);
      spotify.getTrackShortInfosInPlaylist(authInfo.accessToken, pl.id).then((tinfos) => {
        setMyPlaylistTracks(tinfos);
      });
    }
  }, [mySelectedPlaylistValue]);

  // update pair tracks
  useEffect(() => {
    if (pairPlaylists && pairSelectedPlaylistValue !== "") {
      const pl: spotify.PlaylistInfo = pairPlaylists[parseInt(pairSelectedPlaylistValue)];
      console.log(`Selected ${parseInt(mySelectedPlaylistValue)}`, pl);
      spotify.getTrackShortInfosInPlaylist(authInfo.accessToken, pl.id).then((tinfos) => {
        setPairPlaylistTracks(tinfos);
      });
    }
  }, [pairSelectedPlaylistValue]);

  // match tracks
  useEffect(() => {
    if (myPlaylistTracks.length > 0 && pairPlaylistTracks.length > 0) {
      console.log("Matching tracks...");
      const myTrackIDS = myPlaylistTracks.map((t: any) => t.id);
      const pairTrackIDS = pairPlaylistTracks.map((t: any) => t.id);
      // mark the intersecting arrays as matched
      let i;
      let j;
      const matches: string[] = [];
      for (i = 0; i < myTrackIDS.length; ++i) {
        j = pairTrackIDS.indexOf(myTrackIDS[i]);
        if (j !== -1) {
          matches.push(myTrackIDS[i]);
        }
      }
      setMatchingTracksIDs(matches);
      console.log("Done, found", matches.length, "matches!");
    }
  }, [myPlaylistTracks, pairPlaylistTracks]);

  // compoundDidMount
  useEffect(() => {
    spotify.getCurrentUserPlaylists(authInfo.accessToken).then((pls) => setMyPlaylists(pls));
  }, []);

  return (
    <Container>
      <Grid container rowGap="1em" columnGap="0.5em" justifyContent="center">
        {/* Target user */}
        <Grid item xs={9} sx={{ height: "3.5em" }}>
          {pair ? (
            <Typography
              variant="h5"
              component="a"
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
                height: "100%",
                flexGrow: 1,
                textAlign: "end",
              }}
            >
              {pair.name}
            </Typography>
          ) : (
            <TextField
              label="Paste other user's Spotify Profile URL"
              variant="outlined"
              color="primary"
              value={targetPairText}
              sx={{ width: "100%", height: "100%" }}
              error={targetPairTextTextError !== ""}
              helperText={targetPairTextTextError}
              onChange={(e) => {
                setTargetPairText(e.target.value);
              }}
            />
          )}
        </Grid>
        <Grid item xs={1}>
          {pair ? (
            <Button
              variant="contained"
              onClick={handleRemovePair}
              color="primary"
              sx={{ width: "100%", height: "100%" }}
            >
              <PersonRemoveIcon />
            </Button>
          ) : (
            <Button variant="contained" onClick={handleAddPair} color="primary" sx={{ width: "100%", height: "100%" }}>
              <PersonAddIcon />
            </Button>
          )}
        </Grid>
        {/* My playlists */}
        <Grid item xs={5}>
          <SelectionBox
            playlists={myPlaylists}
            selection={mySelectedPlaylistValue}
            changeHandler={handleMyPlaylistChange}
            label="Choose your playlist"
          />
        </Grid>
        {/* Their playlists */}
        <Grid item xs={5}>
          {pairPlaylists ? (
            <SelectionBox
              playlists={pairPlaylists}
              selection={pairSelectedPlaylistValue}
              changeHandler={handlePairPlaylistChange}
              label="Other User's Playlists"
            />
          ) : (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Choose a user first.</InputLabel>
              <Select
                labelId="pairplaylist-select"
                id="pairplaylist-select"
                value={""}
                disabled
                variant="standard"
              ></Select>
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
