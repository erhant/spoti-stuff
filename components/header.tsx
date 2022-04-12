import { Header as _Header, Container, MediaQuery, Title, Group, Button, Anchor, Avatar, Tooltip } from "@mantine/core"
import { BrandSpotify } from "tabler-icons-react"
import { deleteSessionUser, setSessionUser } from "../api/session-storage"

import * as spotify from "../api/spotify"
import { useSessionContext } from "../context/session"

type Props = {
  resetSelection: () => void
}
const Header = ({ resetSelection }: Props) => {
  const { session, setSession } = useSessionContext()

  return (
    <_Header height={60} px="lg" mt="lg">
      <Container>
        <Group position="left">
          <BrandSpotify size={24} />
          <Title order={4} onClick={() => resetSelection()} sx={{ cursor: "pointer" }}>
            SpotiStuff
          </Title>

          {/* space in between */}
          <div style={{ flexGrow: 1 }} />

          {session.user ? (
            <>
              <Tooltip label={`Logged in as ${session.user.name}`}>
                <Avatar radius={100} src={session.user.imageURL}></Avatar>
              </Tooltip>

              <Button
                onClick={() => {
                  setSession({ isAuthenticated: false })
                  deleteSessionUser()
                  resetSelection()
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Anchor href={spotify.AUTHENTICATION_HREF}>
              <Button>Login</Button>
            </Anchor>
          )}
        </Group>
      </Container>
    </_Header>
  )
}

export default Header
