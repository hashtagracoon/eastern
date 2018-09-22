const _debug = false;

module.exports = {
  logger: (output) => {
    if(_debug) console.log(output);
    else return;
  }
};
