import React from "react";
import { Box, Typography } from "@mui/material";
import * as spotify from "../../api/spotify";
import styles from "./style.module.scss";

const height = 1;

export default function TrackView({ track }: { track: spotify.TrackInfo }) {
  return (
    <Box
      sx={{
        textAlign: "left",
        position: "relative",
      }}
    >
      <img src={track.album.imageURL} style={{ objectFit: "scale-down", width: "100%", height: "100%" }} />
      <Typography
        component="div"
        className={styles.trackname}
        sx={{ backgroundColor: "rgba(0,0,0,0.2)", top: 0, left: 0, position: "absolute", height: `${height}em` }}
      >
        {track.name}
      </Typography>
      <Typography
        component="div"
        sx={{
          backgroundColor: "rgba(0,0,0,0.2)",
          top: `${height}em`,
          left: 0,
          position: "absolute",
          height: `${height}em`,
        }}
      >
        {track.artist.name}
      </Typography>
      <Typography
        component="div"
        sx={{
          backgroundColor: "rgba(0,0,0,0.2)",
          bottom: `${height}em`,
          left: 0,
          position: "absolute",
          height: `${height}em`,
        }}
      >
        {track.album.name}
      </Typography>
    </Box>
  );
}
