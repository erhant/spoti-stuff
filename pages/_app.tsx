import "../styles/globals.css";
import type { AppProps } from "next/app";
import DefaultMantineTheme from "../themes/default";
import { UserContextWrapper } from "../context/user";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";

function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextWrapper>
      <MantineProvider
        theme={{
          ...DefaultMantineTheme,
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Component {...pageProps} />
      </MantineProvider>
    </UserContextWrapper>
  );
}

export default App;
