import React from "react";
import { Root } from "native-base";
import { createStackNavigator } from "react-navigation";

import FrontScreen from "./screens/FrontScreen";
import SearchScreen from "./screens/SearchScreen";
import WordScreen from "./screens/WordScreen";

const AppNavigator = createStackNavigator(
  {
    Front: { screen: FrontScreen },
    Search: { screen: SearchScreen },
    Word: { screen: WordScreen },
  },
  {
    initialRouteName: "Search",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
