const { generateApiKey } = require('../lib/apikey')
const { API_KEY_LENGTH, SALT_LENGTH } = require('../constants')
const { addApiKey, findUserByEmail } = require('../lib/database/utils')
const { createHash, generateSalt } = require('../lib/apikey')

async function getApiKey(_, res) {
  try {
    const apiKey = generateApiKey(API_KEY_LENGTH)
    console.log('getApiKey -> apiKey', apiKey)
    const [user] = await findUserByEmail('A')
    console.log('getApiKey -> user', user)
    const { id: userId } = user
    const hash = createHash(apiKey)
    const salt = generateSalt(SALT_LENGTH)
    await addApiKey({ apiKeyHash: hash, salt })
    console.log('getApiKey -> hash', hash)
    res.status('200').json({ apiKey: salt + apiKey })
  } catch (error) {
    console.log('getApiKey -> error', error)
  }
}

module.exports = {
  getApiKey,
}
