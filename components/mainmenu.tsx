import { Group, Box, Paper, Title, Text, Overlay } from "@mantine/core"
import { Dispatch, SetStateAction, useState } from "react"
import { useSessionContext } from "../context/session"
import SelectionType from "../types/selection"
import SpotiDiff from "./spotidiff"
import SpotiFind from "./spotifind"
import SpotiPeek from "./spotipeek"
import Head from "next/head"

type Props = {
  selection: SelectionType
  setSelection: Dispatch<SetStateAction<SelectionType>>
}
const MainMenu = ({ selection, setSelection }: Props) => {
  const { session } = useSessionContext()

  const MenuItem = ({
    title,
    description,
    selectionKey,
  }: {
    title: string
    description: string
    selectionKey: SelectionType
  }) => {
    return (
      <Box sx={{ position: "relative", width: "50%", minWidth: "300px" }}>
        <Paper
          sx={{ cursor: session.isAuthenticated ? "pointer" : undefined, margin: "auto" }}
          p="lg"
          shadow="sm"
          onClick={() => session.isAuthenticated && setSelection(selectionKey)}
          radius="lg"
        >
          <Title>{title}</Title>
          <Text>{description}</Text>
          {!session.isAuthenticated && <Overlay color="gray" opacity={0.6} blur={1.2} radius="lg" />}
        </Paper>
      </Box>
    )
  }

  return {
    main: (
      <>
        <Head>
          <title>SpotiStuff</title>
        </Head>
        <Group position="center">
          <MenuItem
            title="SpotiFind"
            description="Search a Spotify track within the playlists of some user. If the track is added in any of the playlists, you will be able to see them."
            selectionKey="find"
          />
          <MenuItem
            title="SpotiPeek"
            description="Peek at the audio features of your currently playing track."
            selectionKey="peek"
          />
          <MenuItem
            title="SpotiDiff"
            description="Compare playlists of two users, to see if they have the same tracks or not."
            selectionKey="diff"
          />
        </Group>
      </>
    ),
    find: <SpotiFind />,
    peek: <SpotiPeek />,
    diff: <SpotiDiff />,
  }[selection]
}

export default MainMenu
