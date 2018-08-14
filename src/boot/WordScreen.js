import Expo from "expo";
import React, { Component } from "react";
import FitImage from "react-native-fit-image";
import { Container, Content, Card, CardItem, Body, Text, Button, Icon } from "native-base";
import parser from "../api/DictionaryParser";

const _debug = true;
const logger = (output) => {
  if(_debug) console.log(output);
  else return;
};

export default class WordScreen extends Component {

  state = {
    searchResultArray: null,
    searchImageArray: null,
  };

  searchForWord = (word) => {
    let url = "https://dictionary.cambridge.org/dictionary/english/" + word;
    fetch(url).then((response) => {
      return response.text();
    })
    .then((text) => {

      let searchResultArray = parser.parse(text);

      if(searchResultArray.length === 0) {
        logger("Unable to find this word");
      }
      else {
        logger("Get Search Result:")
        logger(searchResultArray);
      }

      this.setState({ searchResultArray });
      logger("* state change")
      logger(this.state.searchResultArray)
    })
    .catch((err) => {
      logger(err);
    });
  }

  searchForImage = (word) => {

    let imageUrl = "https://www.google.com.tw/search?q=" + word + "&tbm=isch";

    fetch(imageUrl).then((response) => {
      return response.text();
    })
    .then((text) => {

      let searchImageArray = parser.parseImages(text);

      if(searchImageArray.length === 0) {
        logger("Unable to find this image");
      }
      else {
        logger("Get Image Result:")
        logger(searchImageArray);
      }

      this.setState({ searchImageArray });
      logger("* state change");
      logger(this.state.searchImageArray);
    })
    .catch((err) => {
      logger(err);
    });
  }

  playTrack = (url) => {

    let soundObject = new Expo.Audio.Sound();

    try {
      soundObject.loadAsync({ uri: "https://dictionary.cambridge.org" + url })
      .then(() => {
        soundObject.playAsync();
      });
    }
    catch(err) {
      logger(err);
    }
  }

  componentDidMount = () => {
    let word = "belittle";
    this.searchForWord(word);
    this.searchForImage(word);
  }

  renderWaitingView = () => {
    return (
      <Text>Waiting for search result...</Text>
    );
  }

  renderNotFoundView = () => {
    return (
      <Text>Cannot find this word... Sorry...</Text>
    );
  }

  renderMainEntries = (wordEntries) => {
    return (
      wordEntries.map((entry, i) => {
        return (
          <Card key={ i }>

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

            { this.renderMeanings(entry.meanings) }

          </Card>
        )
      })
    );
  }

  renderMeanings = (meanings) => {
    return (
      meanings.map((entry, i) => {
        return (
          <CardItem bordered key={ i }>
            <Body>
              <Text style={{ fontWeight: "bold" }}>{ entry.meaning }</Text>

              { this.renderExamples(entry.egs) }

            </Body>
          </CardItem>
        )
      })
    );
  }

  renderExamples = (examples) => {
    return (
      examples.map((entry, i) => {
        return (
          <Text style={{ fontStyle: "italic" }} key={ i }>{ entry }</Text>
        )
      })
    );
  }

  renderImages = (images) => {
    return (
      <Card>
      {
        images.map((entry, i) => {
          logger("render " + entry)
          return (
            <FitImage key={i}
              resizeMode="contain"
              style={{ margin: 10 }}
              source={{ uri: entry }}/>
          )
        })
      }
      </Card>
    );
  }

  render() {
    const result = this.state.searchResultArray;
    const images = this.state.searchImageArray;

    if(result == null || images == null) {
      return (
        <Container>
          { this.renderWaitingView() }
        </Container>
      );
    }
    else if(result.length === 0) {
      return (
        <Container>
          { this.renderNotFoundView() }
        </Container>
      );
    }
    else {
      logger("Can Render Result Now.");
      logger(result);
      return (
        <Container>
          <Content padder>

          { this.renderMainEntries(result) }

          { this.renderImages(images) }

          </Content>
        </Container>
      )
    }
  }
}
