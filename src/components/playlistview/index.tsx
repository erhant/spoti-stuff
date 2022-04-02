import React from "react";
import { Box, Typography } from "@mui/material";
import * as spotify from "../../api/spotify";
import styles from "./style.module.scss";

export default function PlaylistView({ playlist }: { playlist: spotify.PlaylistInfo }) {
  return (
    <Box className={styles.box}>
      <img className={styles.image} src={playlist.playlistCover} />
      <span className={`${styles.playlistname} ${styles.overlaytext}`}>&nbsp; {playlist.name}</span>
      <span className={`${styles.numtracks} ${styles.overlaytext}`}>&nbsp; {playlist.numTracks} Tracks</span>
    </Box>
  );
}
