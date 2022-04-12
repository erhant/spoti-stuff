import { createContext, ReactChild, useContext, useState } from "react"
import SessionType from "../types/session"

const defaultUserState: SessionType = {
  isAuthenticated: false,
}
const SessionContext = createContext({
  session: defaultUserState,
  // this empty function will be replaced by setState at the parent App.tsx
  setSession: (session: SessionType) => {},
})

export const SessionContextWrapper = ({ children }: { children: ReactChild }) => {
  const [session, setSession] = useState(defaultUserState)
  return <SessionContext.Provider value={{ session, setSession }}>{children}</SessionContext.Provider>
}

export function useSessionContext() {
  return useContext(SessionContext)
}
