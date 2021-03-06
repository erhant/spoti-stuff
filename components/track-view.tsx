import { BackgroundImage, Box, Text } from "@mantine/core"
import { TrackInfo } from "../types/spotify"

const DEFAULT_HEIGHT: string = "min(90vw,375px)"
const DEFAULT_WIDTH: string = "min(90vw,375px)"
type Props = {
  track: TrackInfo
  height?: string
  width?: string
}
const TrackView = ({ track, width, height }: Props) => {
  return (
    <Box style={{ height: height || DEFAULT_HEIGHT, width: width || DEFAULT_WIDTH }}>
      <BackgroundImage src={track.album.imageURL} sx={{ width: "100%", height: "100%", position: "relative" }}>
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
          <Text sx={{ fontWeight: "bolder" }}>{track.name}</Text>
          <Text>{track.artist.name}</Text>
        </Box>
        <Box
          pb="md"
          px="md"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            color: "white",
            left: 0,
            bottom: 0,
            position: "absolute",
            width: "100%",
          }}
        >
          <Text sx={{ fontWeight: "bolder" }}>{track.album.name}</Text>
        </Box>
      </BackgroundImage>
    </Box>
  )
}

export default TrackView
