import { Audio } from "expo";
import React, { Component } from "react";
import FitImage from "react-native-fit-image";
import { BackHandler } from "react-native";
import { Container, Content, Card, CardItem, Body, Text, Button, Icon, Spinner } from "native-base";
import { StackActions, NavigationActions } from "react-navigation";
import SearchBar from "../components/SearchBar";
import searcher from "../api/SearchWrapper";

import { connect } from "react-redux";

import { logger } from "../api/Debugger";

class WordScreen extends Component {

  state = {
    searchResultArray: null,
    searchImageArray: null,
    searchResultFrom: null,
    showImage: false
  };

  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener("didFocus", payload => {
      BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPressAndroid);
    });
  }

  componentDidMount() {
    //const word = this.props.navigation.getParam("word", "");
    const word = this.props.searchWord;
    logger("get param: " + word);
    this.searchForWord(word);
    this.searchForImage(word);
    this._willBlurSubscription = this.props.navigation.addListener("willBlur", payload => {
      BackHandler.removeEventListener("hardwareBackPress", this.onBackButtonPressAndroid);
    });
  }

  onBackButtonPressAndroid = () => {
    logger("hardware back button navigate to search screen!");
    this.goToSearchScreen();
    return true;
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  searchForWord = (word) => {

    let _word = word.replace(" ", "-");

    searcher.searchCambridge(_word).then((searchResultArray) => {
      this.setState({
        searchResultArray: searchResultArray,
        searchResultFrom: "Cambridge"
      });
    })
    .catch((err) => {

      _word = word.replace("-", "%20");
      searcher.searchWikipedia(_word).then((summary) => {
        this.setState({
          searchResultArray: [
            {
              "title": word,
              "meanings": [ {"meaning": summary, "egs": []} ]
            }
          ],
          searchResultFrom: "Wikipedia"
        })
        logger(summary);

      })
      .catch((err) => {
        if(err === "Not Found") {
          this.setState({ searchResultFrom: "NotFound" });
        }
        else if(err === "Error") {
          this.setState({ searchResultFrom: "Error" });
        }
        this.setState({ searchResultArray: [] });
      });

    });

  }

  searchForImage = (word) => {

    logger("search for image");

    searcher.searchImage(word).then((searchImageArray) => {
      this.setState({ searchImageArray });
    })
    .catch((err) => {
      logger("search for image error: " + err);
      this.setState({ searchImageArray: [] });
    });

  }

  playTrack = (url) => {

    let soundObject = new Audio.Sound();

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
/*
  componentDidMount = () => {
    const word = this.props.navigation.getParam("word", "");
    logger("get param: " + word);
    this.searchForWord(word);
    this.searchForImage(word);
  }
*/
  renderWaitingView = () => {
    return (
      <Content padder contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
        <Spinner color="blue" />
      </Content>
    );
  }

  renderNotFoundView = () => {
    return (
      <Content padder contentContainerStyle={{ justifyContent: "center", flex: 1, flexDirection: "row" }}>
        <Button
          bordered
          style={{ alignSelf: "center" }}
          onPress={ this.goToSearchScreen }>
          <Icon name="ios-arrow-back" />
          <Text uppercase={ false }>No Match Found</Text>
        </Button>
      </Content>
    );
  }

  renderErrorView = () => {
    return (
      <Content padder contentContainerStyle={{ justifyContent: "center", flex: 1, flexDirection: "row" }}>
        <Button
          bordered
          warning
          style={{ alignSelf: "center" }}
          onPress={ this.goToSearchScreen }>
          <Icon name="ios-arrow-back" />
          <Text uppercase={ false }>Error: No Internet Access</Text>
        </Button>
      </Content>
    );
  }

  renderWikipediaSummary = (wordEntries) => {
    return (
      wordEntries.map((entry, i) => {
        return (
          <Card key={ i }>
            <CardItem header bordered>
              <Text>{ entry.title }</Text>
            </CardItem>
            <CardItem bordered key={ i }>
              <Body>
                <Text>
                  { entry.meanings[0].meaning }
                </Text>
              </Body>
            </CardItem>
          </Card>
        );
      })
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
              <Button transparent onPress={ () => this.playTrack(entry.mp3) }>
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
              <Text style={{ fontWeight: "bold", marginBottom: 8, lineHeight: 22 }}>{ entry.meaning }</Text>

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
        // FIXME if there're too many examples, expo would crash
        if(i > 1) return;
        return (
          <Text style={{ fontStyle: "italic", marginBottom: 8, lineHeight: 22 }} key={ i }>{ entry }</Text>
        )
      })
    );
  }

  showImages = () => {
    this.setState({ showImage: true }, () => {
      logger("showImage = " + this.state.showImage);
    })
  }

  hideImages = () => {
    this.setState({ showImage: false }, () => {
      logger("showImage = " + this.state.showImage);
    })
  }

  renderImages = (images) => {

    const showImageButton = (
      <Button block onPress={ this.showImages }>
        <Icon name="md-arrow-dropdown" />
        <Text>Show Images</Text>
      </Button>
    );

    const hideImageButton = (
      <Button block onPress={ this.hideImages }>
        <Icon name="md-arrow-dropup" />
        <Text>Hide Images</Text>
      </Button>
    );

    return (
      <Card>
      { this.state.showImage ? hideImageButton : showImageButton }
      {
        images.map((entry, i) => {
          if(!this.state.showImage) return;
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

  goToSearchScreen = () => {
    //this.props.navigation.goBack();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [ NavigationActions.navigate({ routeName: "Search" }) ],
      key: null
    });

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const result = this.state.searchResultArray;
    const images = this.state.searchImageArray;
    const resultFrom = this.state.searchResultFrom;

    if(resultFrom == null || images == null) {
      return (
        <Container>
          { this.renderWaitingView() }
        </Container>
      );
    }
    else if(resultFrom === "NotFound") {
      return (
        <Container>
          { this.renderNotFoundView() }
        </Container>
      );
    }
    else if(resultFrom === "Error") {
      return (
        <Container>
          { this.renderErrorView() }
        </Container>
      );
    }
    else if(resultFrom === "Cambridge") {
      logger("Can Render Result Now.");
      logger(result);
      return (
        <Container>
          <SearchBar
            inputWord={ this.props.navigation.getParam("word", "") }
            setInputWordFromSearchBar={ () => {} }
            determineSelectedWord={ () => {} }
            onFocus={ this.goToSearchScreen }
          />
          <Content padder>

          { this.renderMainEntries(result) }

          { this.renderImages(images) }

          </Content>
        </Container>
      )
    }
    else if(resultFrom === "Wikipedia") {
      logger("Can Render Result Now. (from wiki)");
      //logger(result);
      return (
        <Container>
          <SearchBar
            inputWord={ this.props.navigation.getParam("word", "") }
            setInputWordFromSearchBar={ () => {} }
            determineSelectedWord={ () => {} }
            onFocus={ this.goToSearchScreen }
            autoFocus={ false }
          />
          <Content padder>

          { this.renderWikipediaSummary(result) }

          { this.renderImages(images) }

          </Content>
        </Container>
      )
    }
  }
}

export default connect(
  (state) => {
    return {
      searchWord: state.wordState.searchWord
    }
  }
)(WordScreen);
