import React from "react";
import Header from "./Header";
import AppButton from "./AppButton";
import styles from "./styles/App.module.scss"
import { AuthContext } from "./context/auth"


function App() {
  const [authenticated, setAuthenticated] = React.useState(false);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      <Header />
      <div className={styles.main}>
        <AppButton name='SpotiSync' />
        <AppButton name='SpotiFind' />
        <AppButton name='SpotiPeek' />
      </div>
    </AuthContext.Provider>
  )
}

export default App;
