import { SQLite, FileSystem, Asset } from "expo";
import React, { Component } from "react";
import { Container, Content } from "native-base";

import SearchBar from "../components/SearchBar";
import ListView from "../components/ListView";

const _debug = true;
const logger = (output) => {
  if(_debug) console.log(output);
  else return;
};

export default class SearchScreen extends Component {

  state = {
    inputWord: "",
    selectedWord: "",
    dbInstance: null,
    autocompleteList: [],
    showImage: false
  };

  toggleShowImage = (bool) => {
    this.setState({showImage: bool}, () => {
      if(this.state.showImage) logger("show image automatically.");
      else logger("not show image anymore.");
    });
  }

  setInputWord = (inputWord) => {
    this.setState({ inputWord }, () => {
      logger("inputWord changes to \"" + this.state.inputWord + "\"");
      this.autocomplete(this.state.inputWord);
    });
  }

  setSelectedWord = (selectedWord) => {
    this.setState({ selectedWord }, () => {
      logger("selectedWord is \"" + this.state.selectedWord + "\"");
      this.setInputWord(this.state.selectedWord);
      this.props.navigation.navigate("Word", { word: this.state.selectedWord, showImage: this.state.showImage, toggleShowImage: this.toggleShowImage });
    });
  }

  setupAutocompleteDatabase = () => {

    const dbFile = FileSystem.documentDirectory + "SQLite/sqlite-31.db";

    FileSystem.getInfoAsync(dbFile).then((res) => {
      if (!(res.exists)) {
        logger("database file not found, download new database file");
        return FileSystem.downloadAsync(
          Asset.fromModule(require("../../assets/database/sqlite-31.db")).uri,
          dbFile
        );
      }
      else {
        logger("database file has already been downloaded!");
      }
      logger("modification time: " + res.modificationTime);
      logger("size: " + res.size);
      logger("uri time: " + res.uri);
    })
    .then(() => {
      logger("open database: ");
      const dbInstance = SQLite.openDatabase("sqlite-31.db");
      this.setState({ dbInstance });
      logger(this.state.dbInstance);
    })
    .catch((err) => {
      logger(err);
    });
  }

  autocomplete = (word) => {
    if(!word) {
      logger("try to autocomplete an empty string, directly return");
      this.setState({autocompleteList: []});
    }
    else {
      this.state.dbInstance.transaction(tx => {
        logger("search \"" + word + "\" in database");
        let sql = "select lemma from words where lemma like '" +
                  word + "%' limit 32;";
        logger("execute sql = " + sql);
        tx.executeSql(
          sql,
          [],
          (_, { rows: { _array: lemma } }) => {
            let autocompleteList = lemma.map(obj => obj.lemma);
            //logger(autocompleteList);

            if(autocompleteList.length === 0) {
              autocompleteList.push(word);
            }

            this.setState({ autocompleteList });
          }
        );
      },
      (error) => logger("execute sql fail: " + error),
      () => logger("execute sql success"));
    }
  }

  componentWillMount() {
    this.setupAutocompleteDatabase();
  }

  render() {
    return (
      <Container>
        <Content padder>
          <SearchBar
            inputWord={ this.state.inputWord }
            setInputWordFromSearchBar={ this.setInputWord }
            determineSelectedWord={ this.setSelectedWord }
            onFocus={ () => { this.setInputWord(""); } }
            autoFocus={ true }
          />
          <ListView
            items={ this.state.autocompleteList }
            determineSelectedWord={ this.setSelectedWord }
          />
        </Content>
      </Container>
    );
  }
}
