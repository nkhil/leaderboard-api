const crypto = require('crypto')
const { SALT_LENGTH } = require('../../constants')

function generateSalt(len) {
  const set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ'
  const setLen = set.length
  let salt = ''
  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

function createHash(str) {
  var salt = generateSalt(SALT_LENGTH)
  console.log('createHash -> salt', salt)
  var hash = md5(str + salt)
  console.log('createHash -> hash', hash)
  return salt + hash;
}

function validateHash(hash, apiKeyFromRequest) {
  console.log('validateHash -> hash', hash)
  var salt = hash.substr(0, SALT_LENGTH);
  console.log('validateHash -> salt', salt)
  var validHash = salt + md5(apiKeyFromRequest + salt);
  console.log('validateHash -> validHash', validHash)
  return hash === validHash;
}

function generateApiKey(len) {
  if (!len) throw new Error(`API Key length not defined. Length supplied: ${len}`)
  return crypto.randomBytes(64).toString('hex').slice(0, len)
}

module.exports = {
  generateApiKey,
  createHash,
  validateHash,
  generateSalt,
}

