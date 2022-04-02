import React from "react";
import { Box, Typography } from "@mui/material";
import * as spotify from "../../api/spotify";
import styles from "./style.module.scss";

export default function TrackView({ track }: { track: spotify.TrackInfo }) {
  return (
    <Box className={styles.box}>
      <img className={styles.image} src={track.album.imageURL} />
      <span className={`${styles.trackname} ${styles.overlaytext}`}>&nbsp; {track.name}</span>
      <span className={`${styles.artistname} ${styles.overlaytext}`}>&nbsp; {track.artist.name}</span>
      <span className={`${styles.albumname} ${styles.overlaytext}`}>&nbsp; {track.album.name}</span>
    </Box>
  );
}
