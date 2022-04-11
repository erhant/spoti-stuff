import {
  Header as _Header,
  Container,
  Text,
  Title,
  Group,
  Button,
  Anchor,
} from "@mantine/core";
import { BrandSpotify } from "tabler-icons-react";

import * as spotify from "../api/spotify";
import { useSessionContext } from "../context/user";

type Props = {
  resetSelection: () => void;
};
const Header = ({ resetSelection }: Props) => {
  const { session, setSession } = useSessionContext();

  return (
    <_Header height={60} px="lg" mt="lg">
      <Container>
        <Group position="left">
          <BrandSpotify size={36} />
          <Title
            order={3}
            onClick={() => resetSelection()}
            sx={{ cursor: "pointer" }}
          >
            SpotiStuff
          </Title>

          {/* space in between */}
          <div style={{ flexGrow: 1 }} />

          {session.user ? (
            <>
              <Text>{session.user.name}</Text>
              <Button
                onClick={() => {
                  resetSelection();
                  setSession({ isAuthenticated: false });
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
  );
};

export default Header;
