
function arrayHasProps(array, propName, propValue) {
  return array.every(item => {
    return item[propName].toString() === propValue
  })
}

module.exports = {
  arrayHasProps,
}
