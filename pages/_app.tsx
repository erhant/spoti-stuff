import "../styles/globals.scss"
import type { AppProps } from "next/app"
import DefaultMantineTheme from "../themes/default"
import { SessionContextWrapper } from "../context/session"
import { MantineProvider, ColorScheme, ColorSchemeProvider } from "@mantine/core"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextWrapper>
      <MantineProvider
        theme={{
          ...DefaultMantineTheme,
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </MantineProvider>
    </SessionContextWrapper>
  )
}

export default App
