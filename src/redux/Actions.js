export const setSearchWord = (searchWord) => {
  return {
    type: "SET_SEARCH_WORD",
    searchWord
  };
};

export const setDbInstance = (dbInstance) => {
  return {
    type: "SET_DB_INSTANCE",
    dbInstance
  };
};
