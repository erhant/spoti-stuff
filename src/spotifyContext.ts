import React from "react";

spotifyContext = React.createContext({ user: {} });
export { spotifyContext };
export type spotifyContextType = {
  user: object | {};
};
