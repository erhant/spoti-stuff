import { Footer as _Footer, Group, Text, Anchor } from "@mantine/core"
import { BrandGithub } from "tabler-icons-react"

const Footer = () => {
  return (
    <_Footer height={0} py="md">
      <Group position="center">
        <Text>&copy; Erhan Tezcan {new Date().getFullYear()} &nbsp; </Text>
        <Anchor href="https://github.com/erhant/spoti-stuff" sx={{ color: "black" }}>
          <BrandGithub size={24} />
        </Anchor>
      </Group>
    </_Footer>
  )
}

export default Footer
