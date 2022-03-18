import React from "react";
import Header from "./Header";
import AppButton from "./AppButton";
import styles from "./styles/App.module.scss"

import { spotifyContext } from "./spotifyContext";

class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    // get and set currently logged in user to state
  }

  render() {
    return (
      <spotifyContext.Provider value={this.state.user}>
        <Header />
        <div className={styles.main}>
          <AppButton name='SpotiSync' />
          <AppButton name='SpotiFind' />
          <AppButton name='SpotiPeek' />
        </div>
      </spotifyContext.Provider>
    )
  }
}

export default App;
