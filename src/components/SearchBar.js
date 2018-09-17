import React, { Component } from "react";
import { Header, Item, Input, Icon, Button } from "native-base";

export default class SearchBar extends Component {

  state = {
    inputWord: this.props.inputWord
  };

  onChangeText = (inputWord) => {
    this.setState({ inputWord }, () => {
      this.props.setInputWordFromSearchBar(this.state.inputWord);
    });
  }

  onPress = () => {
    this.props.determineSelectedWord(this.state.inputWord);
  }

  onSubmitEditing = () => {
    if(this.state.inputWord !== "") {
      this.props.determineSelectedWord(this.state.inputWord);
    }
  }

  render() {
    return (
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              value={ this.props.inputWord }
              onChangeText={ this.onChangeText }
              onFocus={ this.props.onFocus }
              autoFocus={ this.props.autoFocus }
              onSubmitEditing={ this.onSubmitEditing }
            />
            <Button transparent onPress={ this.onPress }>
              <Icon name="send" />
            </Button>
          </Item>
        </Header>
    );
  }
}
