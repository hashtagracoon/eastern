import { SQLite, FileSystem } from "expo";
import React, { Component } from "react";
import { Container } from "native-base";

import SearchBar from "../component/SearchBar";
import ListView from "../component/ListView";

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
    autocompleteList: []
  };

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
      this.props.navigation.navigate("Word", { word: this.state.selectedWord });
    });
  }

  setupAutocompleteDatabase = () => {

    const dbFile = FileSystem.documentDirectory + "SQLite/sqlite-31.db";

    FileSystem.getInfoAsync(dbFile).then((exists) => {
      if (!exists) {
        logger("database file not found, download new database file");
        return FileSystem.downloadAsync(
          "http://hashtagracoon.pythonanywhere.com/assets/sqlite-31.db",
          dbFile
        );
      }
      else {
        logger("database file has already been downloaded!");
      }
    })
    .then(() => {
      logger("open database: ");
      const dbInstance = SQLite.openDatabase("sqlite-31.db");
      this.setState({ dbInstance });
      logger(this.state.dbInstance);
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
            logger(autocompleteList);
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
        <SearchBar
          value={this.state.inputWord}
          getSearchWord={this.setInputWord}
          getSelectedWord={this.setSelectedWord}
        />
        <ListView
          items={this.state.autocompleteList}
          getSelectedWord={this.setSelectedWord}
        />
      </Container>
    );
  }
}
