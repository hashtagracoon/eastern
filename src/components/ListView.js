import React, { Component } from "react";
import { List, ListItem, Text } from "native-base";

export default class ListView extends Component {

  render() {
    return (
      <List dataArray={ this.props.items } keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag"
        renderRow={(item) =>
          <ListItem button onPress={ () => this.props.determineSelectedWord(item) }>
            <Text>{ item }</Text>
          </ListItem>
      } />
    );
  }

}
