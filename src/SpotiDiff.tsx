import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { LOGIN_URL } from "./api/spotify";
import { AuthInfo, AuthContext } from "./context/auth";

function Item({ text }: { text: string }) {
  return <div style={{ textAlign: "center", backgroundColor: "lightblue" }}>{text}</div>;
}

export default function SpotiDiff() {
  const { authInfo } = useContext(AuthContext);
  const [pair, setPair] = useState("");

  useEffect(() => {});
  return (
    <Container>
      <Grid container>
        <Grid item xs={6}>
          <Button variant="contained" disabled color="primary" sx={{ width: "100%", height: "100%" }}>
            Me
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" onClick={() => {}} color="secondary" sx={{ width: "100%", height: "100%" }}>
            <PersonAddIcon />
          </Button>
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
