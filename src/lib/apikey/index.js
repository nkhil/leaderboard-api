const sh = require('@subgeniuscorp/secret-helper');
const { SALT_LENGTH, API_KEY_LENGTH } = require('../../constants');

function generateSalt(length = 0) {
  const realLength = length || SALT_LENGTH;
  return sh.generateSalt({ length: realLength });
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

function generateApiKey(length = 0) {
  const realLength = length || API_KEY_LENGTH;
  if (!realLength) throw new Error('API Key length not defined.');
  return sh.generateApiKey({
    length: realLength,
  });
}

function createClientSecret(length) {
  return generateSalt(length);
}

module.exports = {
  generateApiKey,
  createHash,
  validateHash,
  generateSalt,
  createClientSecret,
};
