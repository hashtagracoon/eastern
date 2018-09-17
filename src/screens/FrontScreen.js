import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";
import { Container, Text } from "native-base";

export default class FrontScreen extends Component {
  render() {
    return (
      <Container style={styles.containerStyle}>
        <Image
          source={require("../../assets/eastern-logo-small.png")}
          style={styles.imageStyle}
          />
          <Text style={styles.titleStyle}>World Dictionary</Text>
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
    //flex: 0.8,
    //resizeMode: "contain"
  },
  titleStyle: {
    fontSize: 34,
    margin: 5,
    //fontFamily: "Roboto_medium"
  },
});
