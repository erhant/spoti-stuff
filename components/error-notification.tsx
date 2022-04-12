import { Notification } from "@mantine/core"

type Props = {
  message: string
}
const ErrorNotification = ({ message }: Props) => {
  return (
    <Notification title="Error occured!" color="red">
      {message}
    </Notification>
  )
}

export default ErrorNotification
