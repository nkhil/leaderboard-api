const secretHelper = require('@subgeniuscorp/secret-helper');
const { SALT_LENGTH } = require('../../constants');

const sh = secretHelper({ saltLength: SALT_LENGTH });

function generateSalt() {
  return sh.generateSalt();
}

function createHash(str) {
  return sh.createHash(str);
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
