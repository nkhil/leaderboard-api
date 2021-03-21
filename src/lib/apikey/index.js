const crypto = require('crypto');
const { SALT_LENGTH } = require('../../constants');

function generateSalt(len) {
  const set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  const setLen = set.length;
  let salt = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) {
    const p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function createHash(str) {
  const salt = generateSalt(SALT_LENGTH);
  const hash = md5(str + salt);
  return salt + hash;
}

function validateHash(hash, valueFromRequest) {
  const salt = hash.substr(0, SALT_LENGTH);
  const validHash = salt + md5(valueFromRequest + salt);
  return hash === validHash;
}

function generateApiKey(len) {
  if (!len) throw new Error('API Key length not defined.');
  return crypto.randomBytes(64).toString('hex').slice(0, len);
}

function createClientId(length) {
  return 'leaderboard_client_'.concat(generateSalt(length));
}

function createClientSecret(length) {
  return generateSalt(length);
}

module.exports = {
  generateApiKey,
  createHash,
  validateHash,
  generateSalt,
  createClientId,
  createClientSecret,
};
