import type { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import MainMenu from "../components/mainmenu"
import Layout from "../components/layout"
import { useSessionContext } from "../context/session"
import AuthInfoType from "../types/authInfo"
import * as spotify from "../api/spotify"
import SessionType from "../types/session"
import { getSessionUser, setSessionUser } from "../api/session-storage"
import SelectionType from "../types/selection"

// used to obtain the token from spotify redirection
function parseHash(hash: string): AuthInfoType {
  // the given string is of form "#key1=val1&key2=val2&key3=val3"
  // there is a generic-one-liner for this, but i want to be more explicit
  const kvs = hash.slice(1).split("&")
  return {
    accessToken: kvs[0].split("=")[1],
    expiresIn: parseInt(kvs[2].split("=")[1]),
    tokenType: kvs[1].split("=")[1],
  }
}

const Home: NextPage = () => {
  const { setSession } = useSessionContext()
  const [selection, setSelection] = useState<SelectionType>("main")

  // componentDidMount
  useEffect(() => {
    // check if user exists in session storage
    const u = getSessionUser()
    if (u) {
      setSession(u)
      return
    }

    // check if hash exists in URL (possible redirection from Spotify)
    if (window.location.hash.length > 0) {
      // parse authentication token
      const authInfo = parseHash(window.location.hash)
      spotify.getCurrentUser(authInfo.accessToken).then((user) => {
        const session: SessionType = {
          isAuthenticated: true,
          authInfo: authInfo,
          user: user,
        }
        setSessionUser(session)
        setSession(session)
      })
    }
  }, [setSession])

  return (
    <>
      <Head>
        <title>SpotiStuff</title>
        <meta name="description" content="A mini-utility tool for Spotify, made by erhant." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout resetSelection={() => setSelection("main")}>
        <MainMenu selection={selection} setSelection={setSelection} />
      </Layout>
    </>
  )
}

export default Home
