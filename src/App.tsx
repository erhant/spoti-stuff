import React from "react";
import Header from "./Header";
import Button from "@mui/material/Button";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import SearchIcon from "@mui/icons-material/Search";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Typography from "@mui/material/Typography";
import styles from "./styles/App.module.scss"

function makeAppButtonIcon(name: string) {
  switch (name) {
    case "SpotiSync":
      return (<LeakAddIcon className={styles.icon} />);
    case "SpotiFind":
      return (<SearchIcon className={styles.icon} />)
    case "SpotiPlay":
      return (<PlayArrowIcon className={styles.icon} />)
  }
}

function AppButton({ name }: { name: string }) {
  return (
    <Button
      variant="outlined"
      className={styles.button}
    >
      {makeAppButtonIcon(name)}
      <Typography variant="body1" component="span">
        {name}
      </Typography>
    </Button>
  )
}

function App() {
  return (
    <div>
      <Header />
      <div className={styles.main}>
        <AppButton name='SpotiSync' />
        <AppButton name='SpotiFind' />
        <AppButton name='SpotiPlay' />
      </div>
    </div>
  );
}

export default App;
