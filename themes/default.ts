import { MantineThemeOverride } from "@mantine/core"
type TenColors = [string, string, string, string, string, string, string, string, string, string]

// "#1D8954"
const dynamicSpoti: TenColors = [
  "#e1feef",
  "#bcf3d8",
  "#94e9c0",
  "#6ce0a7",
  "#45d78f",
  "#2cbd75",
  "#1f935a",
  "#136940",
  "#054026",
  "#001709",
]
const constSpoti: TenColors = [
  "#1D8954",
  "#1D8954",
  "#1D8954",
  "#1D8954",
  "#1D8954",
  "#1D8954",
  "#1D8954",
  "#1D8954",
  "#1D8954",
  "#1D8954",
]

const DefaultMantineTheme: MantineThemeOverride = {
  fontFamily: "Avenir, Verdana, sans-serif",
  colors: {
    spoti: constSpoti,
  },
  primaryColor: "spoti",
}
export default DefaultMantineTheme
