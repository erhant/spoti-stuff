import { Text, Title } from "@mantine/core"

type Props = {
  label: string
  feature: number
}
const TrackFeature = ({ label, feature }: Props) => {
  return (
    <Title>
      {label} {feature}%
    </Title>
  )
}

export default TrackFeature
