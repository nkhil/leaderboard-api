function arrayHasProps(array, propName, propValue) {
  return array.every((item) => item[propName].toString() === propValue);
}

module.exports = {
  arrayHasProps,
};
