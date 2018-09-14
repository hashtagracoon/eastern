import { combineReducers } from 'redux';

const initialState = {
  searchWord: ""
}

const wordReducer = (state = initialState, action) => {
  switch(action.type) {
    case "SET_SEARCH_WORD":
      return { ...state, searchWord: action.searchWord };
    default:
      return state;
  }
};

export const reducers = combineReducers({
  wordState: wordReducer
});
