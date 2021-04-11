const sh = require('@subgeniuscorp/secret-helper');
const { SALT_LENGTH } = require('../../constants');

function generateSalt() {
  return sh.generateSalt({ length: SALT_LENGTH });
}

function createHash(str) {
  return sh.createHash({ valueToHash: str });
}

function validateHash(hash, valueFromRequest) {
  return sh.validateHash({
    hashValue: hash,
    valueToCompare: valueFromRequest,
  });
}

function generateApiKey() {
  return sh.generateApiKey();
}

module.exports = {
  generateApiKey,
  createHash,
  validateHash,
  generateSalt,
};
