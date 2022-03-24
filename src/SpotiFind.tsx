import React, { useState, useContext } from "react";
import { Container, LinearProgress, TextField, Button } from "@mui/material";
import styles from './styles/SpotiFind.module.scss'
import SearchIcon from "@mui/icons-material/Search";
import * as spotify from "./api/spotify";
import { AuthContext } from "./context/auth";

export default function SpotiFind() {
  const { authInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  return (
    <Container className={styles.container}>
      {
        loading
          ? <LinearProgress className={styles.progress} />
          :
          (<div>
            <TextField className={styles.songlinkField} label="Song Link" variant="outlined" />
            <Button className={styles.searchButton} variant="outlined" endIcon={<SearchIcon />}>Find</Button>
          </div>)
      }

    </Container>
  );
}
