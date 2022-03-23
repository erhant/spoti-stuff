import React, { useEffect, useState } from "react";
import Header from "./Header";
import AppButton, { AppSelection } from "./AppButton";
import styles from "./styles/App.module.scss";
import { AuthContext, loggedOutAuthInfo, AuthInfo } from "./context/auth";

// used to obtain the token from spotify redirection
function parseHash(hash: string): AuthInfo {
  const kvs = hash.slice(1).split("&");
  return {
    isAuthenticated: true,
    accessToken: kvs[0].split("=")[1],
    expiresIn: parseInt(kvs[2].split("=")[1]),
    tokenType: kvs[1].split("=")[1],
  };
}

function App() {
  const [authInfo, setAuthInfo] = useState(loggedOutAuthInfo);
  const [appSel, setAppSel] = useState(AppSelection.None);

  // componentDidMount
  useEffect(() => {
    if (window.location.hash.length > 0) {
      const authInfo = parseHash(window.location.hash);
      setAuthInfo(authInfo);
    }
  }, []);

  function getAppSelection() {
    if (appSel == AppSelection.None) {
      return (
        <div className={styles.main}>
          <AppButton selection={appSel} setSelection={setAppSel} />
          <AppButton selection={appSel} setSelection={setAppSel} />
          <AppButton selection={appSel} setSelection={setAppSel} />
        </div>
      );
    } else return <span>kdshgkdjh</span>;
  }
  return (
    <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
      <Header />
      {getAppSelection()}
    </AuthContext.Provider>
  );
}

// <span>{JSON.stringify(authInfo)}</span>

export default App;
