import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import SafetyDividerIcon from "@mui/icons-material/SafetyDivider";
import SearchIcon from "@mui/icons-material/Search";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// user imports
import Header from "./Header";
import SpotiPeek from "./SpotiPeek";
import SpotiFind from "./SpotiFind";
import SpotiDiff from "./SpotiDiff";
import { AuthContext } from "./context/auth";
import { AppSelection } from "./types/mainmenu";
import styles from "./styles/MainMenu.module.scss";

function AppButton({
  selection,
  setSelection,
}: {
  selection: AppSelection;
  setSelection: (appSel: AppSelection) => void;
}) {
  const { authInfo } = React.useContext(AuthContext);
  const handleClick = () => setSelection(selection);

  return (
    <Button variant="outlined" disabled={!authInfo.isAuthenticated} className={styles.button} onClick={handleClick}>
      {
        {
          [AppSelection.None]: <></>,
          [AppSelection.Diff]: <SafetyDividerIcon className={styles.icon} id={styles.spotidiff} />,
          [AppSelection.Find]: <SearchIcon className={styles.icon} id={styles.spotifind} />,
          [AppSelection.Peek]: <PlayArrowIcon className={styles.icon} id={styles.spotipeek} />,
        }[selection]
      }
      <Typography variant="body1" component="span" className={styles.text}>
        {
          {
            [AppSelection.None]: "",
            [AppSelection.Diff]: "SpotiDiff",
            [AppSelection.Find]: "SpotiFind",
            [AppSelection.Peek]: "SpotiPeek",
          }[selection]
        }
      </Typography>
    </Button>
  );
}

export default function MainMenu() {
  const [appSel, setAppSel] = useState(AppSelection.None);

  return (
    <div>
      <Header sel={appSel} setSel={setAppSel} />
      {
        /* Render the menu or component */
        {
          // Main menu
          [AppSelection.None]: (
            <div className={styles.selectionMenu}>
              <AppButton selection={AppSelection.Find} setSelection={setAppSel} />
              <AppButton selection={AppSelection.Peek} setSelection={setAppSel} />
              <AppButton selection={AppSelection.Diff} setSelection={setAppSel} />
            </div>
          ),
          // SpotiFind
          [AppSelection.Find]: <SpotiFind />,
          // SpotiPeek
          [AppSelection.Peek]: <SpotiPeek />,
          // SpotiDiff
          [AppSelection.Diff]: <SpotiDiff />,
        }[appSel]
      }
    </div>
  );
}
