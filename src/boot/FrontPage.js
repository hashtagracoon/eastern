import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";
import { StyleProvider, Container, Item, Input, Icon, Text } from "native-base";

import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";

export default class FrontPage extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(variables)}>
        <Container style={styles.containerStyle}>
          <Image
            source={require("../../assets/book.png")}
            style={styles.imageStyle}
            />
            <Text style={styles.titleStyle}>World Dictionary</Text>
            <Item rounded>
              <Icon name="ios-search" />
              <Input placeholder="Search" />
            </Item>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    flex: 0.2,
    resizeMode: "contain"
  },
  titleStyle: {
    fontFamily: "vincHand",
    fontSize: 34,
    margin: 5
  },
});
