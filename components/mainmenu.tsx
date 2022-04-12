import { Group, Button, UnstyledButton } from "@mantine/core"
import { Dispatch, SetStateAction, useState } from "react"
import { useSessionContext } from "../context/session"
import SelectionType from "../types/selection"
import Layout from "./layout"
import styles from "../styles/mainmenu.module.scss"
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

  return {
    main: (
      <>
        <Head>
          <title>SpotiStuff</title>
        </Head>
        <Group position="center">
          <Button className={styles["button"]} disabled={!session.user} onClick={() => setSelection("find")}>
            SpotiFind
          </Button>
          <Button className={styles["button"]} disabled={!session.user} onClick={() => setSelection("peek")}>
            SpotiPeek
          </Button>
          <Button className={styles["button"]} disabled={!session.user} onClick={() => setSelection("diff")}>
            SpotiDiff
          </Button>
        </Group>
      </>
    ),
    find: <SpotiFind />,
    peek: <SpotiPeek />,
    diff: <SpotiDiff />,
  }[selection]
}

export default MainMenu
