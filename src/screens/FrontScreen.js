import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";
import { Container, Item, Input, Icon, Text } from "native-base";

export default class FrontScreen extends Component {
  render() {
    return (
      <Container style={styles.containerStyle}>
        <Image
          source={require("../../assets/book.png")}
          style={styles.imageStyle}
          />
          <Text style={styles.titleStyle}>World Dictionary</Text>
          <Item rounded>
            <Icon name="ios-search" />
            <Input placeholder="Search"/>
          </Item>
      </Container>
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
    fontSize: 34,
    margin: 5
  },
});
