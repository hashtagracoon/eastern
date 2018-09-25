import { SQLite, FileSystem, Asset } from "expo";
import React, { Component } from "react";
import { Container, Content, Spinner, Text, Button } from "native-base";

import SearchBar from "../components/SearchBar";
import ListView from "../components/ListView";

import { connect } from "react-redux";
import { setSearchWord, setDbInstance } from "../redux/Actions";

import { logger } from "../api/Debugger";

const dbFileMd5 = "1a21d894f05af7fcb7106777c138e0db";

class SearchScreen extends Component {

  state = {
    inputWord: "",
    selectedWord: "",
    dbInstance: this.props.dbInstance,
    autocompleteList: [],
    cannotDownloadDatabase: false,
    DownloadDatabaseProgress: null
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
      this.props.setSearchWord(this.state.selectedWord);
      this.props.navigation.navigate("Word", { word: this.state.selectedWord });
    });
  }

  async setupAutocompleteDatabase() {

    this.setState({ cannotDownloadDatabase: false });

    const dbFile = FileSystem.documentDirectory + "SQLite/sqlite-31.db";

    await Asset.loadAsync(require("../../assets/database/sqlite-31.db"));
    const dbAsset = Asset.fromModule(require("../../assets/database/sqlite-31.db"));
    logger("load db asset successful.");
    logger(dbAsset.name);
    logger(dbAsset.type);
    logger(dbAsset.uri);
    logger(dbAsset.localUri);

    FileSystem.getInfoAsync(dbFile, { md5: true }).then((res) => {

      if (res.exists && (res.md5 !== dbFileMd5)) {
        logger("database file corrupt, delete and download new database file");
        return new Promise((resolve, reject) => {
          FileSystem.deleteAsync(dbFile, { idempotent: true })
          .finally(() => {
            FileSystem.copyAsync({
              from: dbAsset.localUri,
              to: dbFile
            })
            .then(() => { resolve(); })
            .catch((err) => { reject(err); });
          });
        });
      }
      else if (!res.exists) {
        logger("database file not found, download new database file");
        return new Promise((resolve, reject) => {
          FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite")
          .finally(() => {
            FileSystem.copyAsync({
              from: dbAsset.localUri,
              to: dbFile
            })
            .then(() => { resolve(); })
            .catch((err) => { reject(err); });
          });
        });
      }
      else {
        logger("database file has already been downloaded!");
        logger("md5: " + res.md5);
        logger("modification time: " + res.modificationTime);
        logger("size: " + res.size);
        logger("uri: " + res.uri);
      }
    })
    .then(() => {
      logger("open database: ");
      const dbInstance = SQLite.openDatabase("sqlite-31.db");
      this.setState({ dbInstance });
      this.props.setDbInstance(dbInstance);
      logger(this.state.dbInstance);
    })
    .catch((err) => {
      logger(err);
      this.state.cannotDownloadDatabase = true;
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

    if(this.state.dbInstance == null) {
      return (
        <Content padder contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
          <Button
            bordered
            style={{ alignSelf: "center" }}>
            <Text uppercase={ false }>Syncing Database. Please wait... { this.state.DownloadDatabaseProgress }</Text>
          </Button>
          <Spinner color="blue" />
        </Content>
      );
    }
    else if(this.state.cannotDownloadDatabase === true) {
      return (
        <Content padder contentContainerStyle={{ justifyContent: "center", flex: 1, flexDirection: "row" }}>
          <Button
            bordered
            error
            style={{ alignSelf: "center" }}
            onPress={ this.setupAutocompleteDatabase }>
            <Text uppercase={ false }>Error: No Internet Access, Press to Retry</Text>
          </Button>
        </Content>
      );
    }

    return (
      <Container>
        <SearchBar
          inputWord={ this.state.inputWord }
          setInputWordFromSearchBar={ this.setInputWord }
          determineSelectedWord={ this.setSelectedWord }
          onFocus={ () => { this.setInputWord(""); } }
          autoFocus={ true }
        />
        <Content padder>
          <ListView
            items={ this.state.autocompleteList }
            determineSelectedWord={ this.setSelectedWord }
          />
        </Content>
      </Container>
    );
  }
}

export default connect(
  (state) => {
    return {
      searchWord: state.wordState.searchWord,
      dbInstance: state.dbState.dbInstance
    };
  },
  {
    setSearchWord: setSearchWord,
    setDbInstance: setDbInstance
  }
)(SearchScreen);
