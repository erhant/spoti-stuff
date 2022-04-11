import { Footer as _Footer, Group, Text } from "@mantine/core";

const Footer = () => {
  return (
    <_Footer height={0} py="md">
      <Group position="center">
        <Text>&copy; Erhan Tezcan {new Date().getFullYear()} &nbsp; </Text>
      </Group>
    </_Footer>
  );
};

export default Footer;
