import { Header as _Header, Container, Text, Title, Group, Button, Anchor } from "@mantine/core"
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
          <BrandSpotify size={36} />
          <Title order={3} onClick={() => resetSelection()} sx={{ cursor: "pointer" }}>
            SpotiStuff
          </Title>

          {/* space in between */}
          <div style={{ flexGrow: 1 }} />

          {session.user ? (
            <>
              <Text>Welcome, {session.user.name}</Text>
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
