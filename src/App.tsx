import React from "react";
import Header from "./Header";
import Button from "@mui/material/Button";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const BOX_WIDTH = "45em";
function App() {
  return (
    <div>
      <Header />
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10em",
          width: "100vw",
          marginTop: "5rem",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            alignSelf: "center",
            backgroundColor: "inherit",
            width: BOX_WIDTH,
            height: BOX_WIDTH,
          }}
        >
          <LeakAddIcon style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} />
          <Typography variant="h2" component="span">
            SpotiSync
          </Typography>
        </Button>
        <Button
          variant="outlined"
          sx={{
            alignSelf: "center",
            backgroundColor: "inherit",
            width: BOX_WIDTH,
            height: BOX_WIDTH,
          }}
        >
          <SearchIcon style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} color="action" />
          <Typography variant="h2" component="span">
            SpotiFind
          </Typography>
        </Button>
      </Box>
    </div>
  );
}

export default App;
