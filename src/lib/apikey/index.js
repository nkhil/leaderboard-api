const sh = require('@subgeniuscorp/secret-helper');

function generateSalt() {
  return sh.generateSalt();
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

function createClientSecret() {
  return generateSalt();
}

module.exports = {
  createHash,
  validateHash,
  generateSalt,
  createClientSecret,
};
