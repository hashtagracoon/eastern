import React, { Component } from "react";
import { Container, Header, Item, Input, Icon, Button, Text } from "native-base";

export default class SearchBar extends Component {

  state = {
    searchWord: ""
  };

  onChangeText(searchWord) {
    this.setState({ searchWord }, () => {
      this.props.getSearchWord(this.state.searchWord);
    });
  }

  onPress() {
    this.props.getSelectedWord(this.state.searchWord);
  }

  render() {
    return (
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              value={this.props.value}
              onChangeText={this.onChangeText.bind(this)}/>
            <Button transparent onPress={this.onPress.bind(this)}>
              <Icon name="send" />
            </Button>
          </Item>
        </Header>
    );
  }
}
