import { createContext } from 'react';

export const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: (isAuth: boolean) => { }
});

