export enum AppSelection {
  None = 0,
  Diff = 1,
  Find = 2,
  Peek = 3,
}

export type SetAppSelection = React.Dispatch<React.SetStateAction<AppSelection>>;
