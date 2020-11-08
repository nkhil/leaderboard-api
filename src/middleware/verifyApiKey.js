const { SALT_LENGTH } = require('../constants')
const { findApiKeyHashBySalt } = require('../lib/database/utils')
const { validateHash } = require('../lib/apikey')

async function verifyApiKey(req) {
  try {
    const { 'x-api-key': apiKey } = req.headers
    const salt = apiKey.substr(0, SALT_LENGTH)
    const [apiKeyEntry] = await findApiKeyHashBySalt(salt)
    const { apiKeyHash } = apiKeyEntry
    const apiKeyIsValid = validateHash(apiKeyHash, apiKey.slice(SALT_LENGTH))
    if (!apiKeyIsValid) {
      throw new Error('Invalid API key')
    }
    return true
  } catch (error) {
    console.log('verifyApiKey -> error', error)
  }
}

module.exports = {
  verifyApiKey,
}
