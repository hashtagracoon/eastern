import Expo from "expo";
import React, { Component } from "react";
import { Container, Header, Content, Card, CardItem, Body, Text, Button, Icon } from "native-base";
import parser from "./DictionaryParser";

export default class WordScreen extends Component {

  state = {
    searchResultArray: null,
    soundObject: new Expo.Audio.Sound()
  };

  componentDidMount() {
    let that = this;
    let url = "https://dictionary.cambridge.org/dictionary/english/outline";
    fetch(url)
      .then(function(response) {
        return response.text();
      })
      .then(function(text) {
        let searchResultArray = parser.parse(text);
        if(searchResultArray.length === 0) {
          console.log("Unable to find this word");
        }
        else {
          console.log("Get Search Result:")
          console.log(searchResultArray);
        }
        that.setState({ searchResultArray });
        console.log("* state change")
        console.log(that.state.searchResultArray)
      })
      .catch(err => {
        console.log(err);
      });
  }

  playTrack = (url) => {
    let soundObject = new Expo.Audio.Sound()
    try {
        soundObject.loadAsync({ uri: "https://dictionary.cambridge.org" + url })
        .then(() => {
          soundObject.playAsync()
        })
    }
    catch(err) {
      console.log(err)
    }
  }

  render() {
    const arr = this.state.searchResultArray;
    if(arr == null) {
      return (
        <Text>No Search Happened.</Text>
      );
    }
    else if(arr.length === 0) {
      return (
        <Text>Cannot Find This Word.</Text>
      );
    }
    else {
      console.log("Can Render Result Now.")
      console.log(arr)
      return (
        <Container>
          <Content padder>
          {
            arr.map((entry, i) => {
              return (
                <Card key= { i }>
                  <CardItem header bordered>
                    <Text>{ entry.title }</Text>
                  </CardItem>
                  <CardItem bordered>
                    <Text>{ entry.pos }{ entry.gram }  </Text>
                    <Text>/{ entry.pron }/</Text>

                    <Button transparent onPress={ () => { this.playTrack(entry.mp3) } }>
                      <Icon name="ios-volume-up" />
                    </Button>
                  </CardItem>
                  {
                    entry.meanings.map((_entry, _i) => {
                      return (
                        <CardItem bordered key={ _i }>
                          <Body>
                        <Text style={{ fontWeight: "bold" }}>{ _entry.meaning }</Text>
                        {
                          _entry.egs.map((__entry, __i) => {
                            return (
                              <Text style={{ fontStyle: "italic" }} key={ __i }>{ __entry }</Text>
                            )
                          })
                        }
                          </Body>
                        </CardItem>
                      )
                    })
                  }
                </Card>
              )
            })
          }
          </Content>
        </Container>
      )
    }
  }
}
