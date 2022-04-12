import { Group, Button } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import { useSessionContext } from "../context/session";
import SelectionType from "../types/selection";
import Layout from "./layout";
import SpotiDiff from "./spotidiff";
import SpotiFind from "./spotifind";
import SpotiPeek from "./spotipeek";

type Props = {
  selection: SelectionType;
  setSelection: Dispatch<SetStateAction<SelectionType>>;
};
const MainMenu = ({ selection, setSelection }: Props) => {
  const { session } = useSessionContext();

  return {
    main: (
      <Group position="center">
        <Button disabled={!session.user} onClick={() => setSelection("find")}>
          SpotiFind
        </Button>
        <Button disabled={!session.user} onClick={() => setSelection("peek")}>
          SpotiPeek
        </Button>
        <Button disabled={!session.user} onClick={() => setSelection("diff")}>
          SpotiDiff
        </Button>
      </Group>
    ),
    find: <SpotiFind />,
    peek: <SpotiPeek />,
    diff: <SpotiDiff />,
  }[selection];
};

export default MainMenu;
