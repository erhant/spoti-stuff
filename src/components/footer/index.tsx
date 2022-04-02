import React from "react";
import { Box, Grid, Container } from "@mui/material";
import styles from "./style.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Box textAlign="center">Erhan Tezcan &reg; {new Date().getFullYear()}</Box>
    </footer>
  );
}
