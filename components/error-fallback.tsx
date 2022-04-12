import { Notification, Text } from "@mantine/core"
import { FallbackProps } from "react-error-boundary"
import { X } from "tabler-icons-react"

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Notification title="Error occured!" icon={<X size={18} />} color="red" onClose={resetErrorBoundary}>
      <Text>{error.message}</Text> <Text>You might want to re-login to refresh your session!</Text>
    </Notification>
  )
}

export default ErrorFallback
