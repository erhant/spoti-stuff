import React from "react";
import Button from "@mui/material/Button";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import SearchIcon from "@mui/icons-material/Search";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Typography from "@mui/material/Typography";
import styles from "./styles/App.module.scss";
import { AuthContext } from "./context/auth";
import { EnumDictionary } from "./utils/EnumDictionary";

export enum AppSelection {
  None = 0,
  Sync,
  Find,
  Peek,
}

const mapSelToName: EnumDictionary<AppSelection, string> = {
  [AppSelection.None]: "",
  [AppSelection.Sync]: "SpotiSync",
  [AppSelection.Find]: "SpotiFind",
  [AppSelection.Peek]: "SpotiPeek",
};

export default function AppButton({
  selection,
  setSelection,
}: {
  selection: AppSelection;
  setSelection: (appSel: AppSelection) => void;
}) {
  const { authInfo } = React.useContext(AuthContext);

  function makeAppButtonIcon() {
    switch (selection) {
      case AppSelection.Sync:
        return <LeakAddIcon className={styles.icon} id={styles.spotisync} />;
      case AppSelection.Find:
        return <SearchIcon className={styles.icon} id={styles.spotifind} />;
      case AppSelection.Peek:
        return <PlayArrowIcon className={styles.icon} id={styles.spotipeek} />;
      default:
        return <></>;
    }
  }

  return (
    <Button variant="outlined" disabled={!authInfo.isAuthenticated} className={styles.button}>
      {makeAppButtonIcon()}
      <Typography variant="body1" component="span" className={styles.text}>
        {mapSelToName[selection]}
      </Typography>
    </Button>
  );
}
