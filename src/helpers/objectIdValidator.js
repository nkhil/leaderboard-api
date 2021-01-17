const mongoose = require('mongoose');

function objectIdIsValid(objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
}

module.exports = {
  objectIdIsValid,
}
