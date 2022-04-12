import { ScrollArea, Stack, Text } from "@mantine/core"
import { TrackAudioFeatures } from "../types/spotify"
import TrackFeature from "./track-feature"

type Props = {
  taf: TrackAudioFeatures
}
const TrackAudioFeaturesView = ({ taf }: Props) => {
  return (
    <ScrollArea style={{ height: "400px" }}>
      <Stack>
        <TrackFeature label="Acousticness" feature={taf.acousticness * 100} />
        <TrackFeature label="Energy" feature={taf.energy * 100} />
        <TrackFeature label="Instrumentalness" feature={taf.instrumentalness * 100} />
        <TrackFeature label="Danceability" feature={taf.danceability * 100} />
        <TrackFeature label="Liveness" feature={taf.liveness * 100} />
        <TrackFeature label="Speechiness" feature={taf.speechiness * 100} />
        <TrackFeature label="Valence" feature={taf.valence * 100} />
      </Stack>
    </ScrollArea>
  )
}

export default TrackAudioFeaturesView
