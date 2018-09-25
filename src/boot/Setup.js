import * as Expo from "expo";
import { AppLoading } from "expo";
import React, { Component } from "react";

import App from "../App";

import { Provider } from "react-redux";
import { store } from "../redux/Store";

import { logger } from "../api/Debugger";

export default class Setup extends Component {

  state = {
    isReady: false
  };

  async cacheResourcesAsync() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={ this.cacheResourcesAsync }
          onFinish={ () => { this.setState({ isReady: true }); } }
        />
      );
    }
    return (
      <Provider store={ store }>
        <App />
      </Provider>
    );
  }
}
