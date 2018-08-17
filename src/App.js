import React from "react";
import { Root } from "native-base";
import { createStackNavigator } from "react-navigation";

import FrontScreen from "./screens/FrontScreen";
import SearchScreen from "./screens/SearchScreen";
import WordScreen from "./screens/WordScreen";

const AppNavigator = createStackNavigator(
  {
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        header: null
      }
    },
    Word: { screen: WordScreen },
  },
  {
    initialRouteName: "Search"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
