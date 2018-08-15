import Expo from "expo";
import React, { Component } from "react";
import FitImage from "react-native-fit-image";
import { Container, Content, Card, CardItem, Body, Text, Button, Icon, Spinner } from "native-base";
import parser from "../api/DictionaryParser";

const _debug = true;
const logger = (output) => {
  if(_debug) console.log(output);
  else return;
};

const word = "okag";

export default class WordScreen extends Component {

  state = {
    searchResultArray: null,
    searchImageArray: null,
  };

  searchForWord = (word) => {
    const _word = word.replace(" ", "-");
    let url = "https://dictionary.cambridge.org/dictionary/english/" + _word;
    logger(url);
    fetch(url).then((response) => {
      return response.text();
    })
    .then((text) => {

      let searchResultArray = parser.parseCambridgeDictionary(text);

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

    // Don't use google image anymore
    //let imageUrl = "https://www.google.com.tw/search?q=" + word + "&tbm=isch";
    // Use Bing image
    const _word = word.replace(" ", "%20");
    let imageUrl = "https://www.bing.com/images/search?q=" + _word;
    logger(imageUrl);

    fetch(imageUrl).then((response) => {
      return response.text();
    })
    .then((text) => {

      let searchImageArray = parser.parseBingImage(text);

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
    this.searchForWord(word);
    this.searchForImage(word);
  }

  renderWaitingView = () => {
    return (
      <Content padder contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
        <Spinner color="blue" />
      </Content>
    );
  }

  renderNotFoundView = () => {
    return (
      <Content padder contentContainerStyle={{ alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "row" }}>
        <Text>No Match Found.</Text>
        <Button bordered danger style={{ alignSelf: "center" }}>

          <Text>No Match Found.</Text>
        </Button>
      </Content>
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
