import React, { useState, useContext } from "react";
import { Container, LinearProgress, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles/SpotiFind.module.scss";
import * as spotify from "./api/spotify";
import { AuthContext } from "./context/auth";

export default function SpotiFind() {
  const { authInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<spotify.SearchState>(null);
  const handleSearchClick = () =>
    spotify.findTrackInUserPlaylists(
      authInfo.accessToken,
      "https://open.spotify.com/track/4JW2yU9lIb8jCNv47PpTfZ?si=3105a22549e14f88",
      setSearchState
    );

  return (
    <Container className={styles.container}>
      {loading ? (
        <div>
          <LinearProgress className={styles.progress} />
        </div>
      ) : (
        <div>
          <TextField label="Song Link" variant="outlined" color="primary" />
          <Button
            className={styles.searchButton}
            variant="outlined"
            endIcon={<SearchIcon />}
            onClick={handleSearchClick}
          >
            Find
          </Button>
        </div>
      )}
    </Container>
  );
}
