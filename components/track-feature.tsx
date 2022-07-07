import { Group, Progress, Box, Text } from "@mantine/core"

type Props = {
  label: string
  feature: number
}
const TrackFeature = ({ label, feature }: Props) => {
  return (
    <Box>
      <>
        <Box sx={{ width: "40%", display: "inline-block" }}>
          <Text>{label}</Text>
        </Box>

        <Progress size="xl" value={feature} sx={{ width: "60%", display: "inline-block" }} />
      </>
    </Box>
  )
}

export default TrackFeature
