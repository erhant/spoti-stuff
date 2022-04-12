import { BackgroundImage, Box, Text } from "@mantine/core"
import { PlaylistInfo } from "../types/spotify"

const DEFAULT_HEIGHT: string = "min(90vw,375px)"
const DEFAULT_WIDTH: string = "min(90vw,375px)"
type Props = {
  playlist: PlaylistInfo
  height?: string
  width?: string
}
const PlaylistView = ({ playlist, height, width }: Props) => {
  return (
    <Box style={{ height: height || DEFAULT_HEIGHT, width: width || DEFAULT_WIDTH }}>
      <BackgroundImage src={playlist.playlistCover} sx={{ width: "100%", height: "100%", position: "relative" }}>
        <Box
          pt="md"
          px="md"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            color: "white",
            top: 0,
            left: 0,
            position: "absolute",
            width: "100%",
          }}
        >
          <Text sx={{ fontWeight: "bolder" }}>{playlist.name}</Text>
          <Text>{playlist.numTracks} tracks</Text>
        </Box>
      </BackgroundImage>
    </Box>
  )
}

export default PlaylistView
