import { AppShell, Container } from "@mantine/core"
import { ReactChild } from "react"
import Footer from "./footer"
import Header from "./header"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./error-fallback"

type Props = {
  children: ReactChild
  resetSelection: () => void
}
const Layout = ({ children, resetSelection }: Props) => {
  return (
    <ErrorBoundary onReset={resetSelection} FallbackComponent={ErrorFallback}>
      <AppShell padding="md" header={<Header resetSelection={resetSelection} />} footer={<Footer />}>
        <Container>{children}</Container>
      </AppShell>
    </ErrorBoundary>
  )
}

export default Layout
