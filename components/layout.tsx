import { AppShell, Container } from "@mantine/core";
import { ReactChild } from "react";
import Footer from "./footer";
import Header from "./header";

type Props = {
  children: ReactChild;
  resetSelection: () => void;
};
const Layout = ({ children, resetSelection }: Props) => {
  return (
    <AppShell
      padding="md"
      header={<Header resetSelection={resetSelection} />}
      footer={<Footer />}
    >
      <Container>{children}</Container>
    </AppShell>
  );
};

export default Layout;
