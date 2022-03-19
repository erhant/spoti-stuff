import React from "react";
import Header from "./Header";
import AppButton from "./AppButton";
import styles from "./styles/App.module.scss"
import { checkAuthentication } from "./api/auth";


class App extends React.Component {
  componentDidMount() {
    checkAuthentication();
  }

  render() {
    return (
      <div>
        <Header />
        <div className={styles.main}>
          <AppButton name='SpotiSync' />
          <AppButton name='SpotiFind' />
          <AppButton name='SpotiPeek' />
        </div>
      </div>

    )
  }
}

export default App;
