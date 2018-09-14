import { createStore } from 'redux';
import { reducers } from "./Reducers";

export const configureStore = (initialState = {}) => {
  const store = createStore(reducers, initialState);
  return store;
};

export const store = configureStore();
