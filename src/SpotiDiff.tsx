import React, { useContext, useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Button, TextField, Typography, Container, Grid } from "@mui/material";
import * as spotify from "./api/spotify";
import { AuthInfo, AuthContext } from "./context/auth";

function Item({ text }: { text: string }) {
  return <div style={{ textAlign: "center", backgroundColor: "lightblue" }}>{text}</div>;
}

export default function SpotiDiff() {
  const { authInfo } = useContext(AuthContext);
  const [myPlaylists, setMyPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [pairPlaylists, setPairPlaylists] = useState<spotify.PlaylistInfo[] | null>(null);
  const [pair, setPair] = useState<spotify.User>(null);
  const [pairName, setPairName] = useState("");
  const handleAddPair = () => {
    spotify.getUser(authInfo.accessToken, pairName).then((user) => setPair(user));
  };
  const handleRemovePair = () => setPair(null);

  useEffect(() => {
    if (pair) {
      // a new pair is loaded, load their playlists
      alert("New pair loaded!");
    }
  }, [pair]);

  return (
    <Container>
      <Grid container>
        <Grid item xs={6}>
          <Button variant="contained" disabled color="primary" sx={{ width: "100%", height: "100%" }}>
            Me
          </Button>
        </Grid>
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
                  setPairName(e.target.value);
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
          111
        </Grid>
        {/* Their playlists */}
        <Grid item xs={6}>
          222
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
