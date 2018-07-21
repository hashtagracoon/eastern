import { SQLite, FileSystem } from "expo";
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container } from "native-base";

import SearchBar from "../component/SearchBar";
import ListView from "../component/ListView";

export default class SearchPage extends Component {

  state = {
    searchWord: "",
    selectedWord: "",
    items: [],
    db: null
  };

  getSearchWord(searchWord) {
    this.setState({ searchWord: searchWord }, () => {
      console.log("[getSearchWord] search for word \"" + this.state.searchWord + "\"");
      this.query(this.state.searchWord);
    });
  }

  getSelectedWord(selectedWord) {
    this.setState({ selectedWord: selectedWord }, () => {
      console.log("[getSelectedWord] selected word is \"" + this.state.selectedWord + "\"");
      console.log("[getSelectedWord] search from web");
      this.getSearchWord(selectedWord);
    });
  }

  setup() {

    const dbFile = FileSystem.documentDirectory + "SQLite/sqlite-31.db";

    FileSystem.getInfoAsync(dbFile).then((exists) => {
      if (!exists) {
        console.log("[setup] download new db file");
        return FileSystem.downloadAsync(
          "http://hashtagracoon.pythonanywhere.com/assets/sqlite-31.db",
          dbFile
        );
      }
      else {
        console.log("[setup] db file already been downloaded");
      }
    })
    .then(() => {
      console.log("[setup] open database: ");
      const db = SQLite.openDatabase("sqlite-31.db");
      this.setState({ db: db });
      console.log(this.state.db);

    });
  }

  query(word) {
    if(word === "") {
      console.log("[query] empty string, directly return");
      this.setState({items: []});
      return;
    }
    this.state.db.transaction(tx => {
      console.log("[query] search for word \"" + word + "\"");
      let sql = "select lemma from words where lemma like '" +
                word + "%' limit 32;";
      console.log("[query] sql = " + sql);
      tx.executeSql(
        sql,
        [],
        (_, { rows: { _array: lemma } }) => {
          let arr = lemma.map(obj => obj.lemma);
          console.log(arr);
          this.setState({items: arr});
        }
      );
    },
    (error) => console.log("[query] fail: " + error),
    () => console.log("[query] success"));
  }

  componentWillMount() {
    this.setup();
  }

  render() {
    return (
      <Container>
        <SearchBar
          value={this.state.searchWord}
          getSearchWord={this.getSearchWord.bind(this)}
          getSelectedWord={this.getSelectedWord.bind(this)}
        />
        <ListView
          items={this.state.items}
          getSelectedWord={this.getSelectedWord.bind(this)}
        />
      </Container>
    );
  }
}
