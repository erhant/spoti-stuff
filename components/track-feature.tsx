import { Progress, Text, Title } from "@mantine/core"

type Props = {
  label: string
  feature: number
}
const TrackFeature = ({ label, feature }: Props) => {
  return <Progress size="xl" value={feature} label={label} />
}

export default TrackFeature
