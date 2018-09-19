import { combineReducers } from 'redux';

const wordInitialState = {
  searchWord: "",
};

const dbInitialState = {
  dbInstance: null
}

const wordReducer = (state = wordInitialState, action) => {
  switch(action.type) {
    case "SET_SEARCH_WORD":
      return { ...state, searchWord: action.searchWord };
    default:
      return state;
  }
};

const dbReducer = (state = dbInitialState, action) => {
  switch(action.type) {
    case "SET_DB_INSTANCE":
      return { ...state, dbInstance: action.dbInstance };
    default:
      return state;
  }
};

export const reducers = combineReducers({
  wordState: wordReducer,
  dbState: dbReducer
});
