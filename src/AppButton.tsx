import React from "react";
import Button from "@mui/material/Button";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import SearchIcon from "@mui/icons-material/Search";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Typography from "@mui/material/Typography";
import styles from "./styles/App.module.scss"

function makeAppButtonIcon(name: string) {
  switch (name) {
    case "SpotiSync":
      return (<LeakAddIcon className={styles.icon} id={styles.spotisync} />);
    case "SpotiFind":
      return (<SearchIcon className={styles.icon} id={styles.spotifind} />)
    case "SpotiPeek":
      return (<PlayArrowIcon className={styles.icon} id={styles.spotipeek} />)
  }
}

export default function AppButton({ name }: { name: string }) {
  return (
    <Button
      variant="outlined"
      className={styles.button}
    >
      {makeAppButtonIcon(name)}
      <Typography variant="body1" component="span" className={styles.text}>
        {name}
      </Typography>
    </Button>
  )
}