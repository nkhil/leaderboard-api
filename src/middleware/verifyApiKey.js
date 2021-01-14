const { SALT_LENGTH } = require('../constants')
const { findApiKeyByClientId } = require('../lib/database/utils')
const { validateHash } = require('../lib/apikey');
const logger = require('pino')();

function getCredentialsFromHeaders(req) {
  const clientId = req.headers['x-client-id'];
  const clientSecret = req.headers['x-client-secret'];
  const apiKey = req.headers['x-api-key'];
  return {
    clientId,
    clientSecret,
    apiKey,
  }
}

async function verifyApiKey(req) {
  try {
    logger.info({ msg: `OP001_01: Verifying API key` })
    const { clientId, clientSecret, apiKey } = getCredentialsFromHeaders(req)
    const apiKeyEntry = await findApiKeyByClientId(clientId, apiKey);
    if (!apiKeyEntry.length) {
      logger.info({ msg: `OP001_02: No api keys found for clientId ${clientId}` });
      return false;
    }
    const { clientSecretHash } = apiKeyEntry[0]
    const clientSecretIsValid = validateHash(clientSecretHash, clientSecret)
    if (!clientSecretIsValid) {
      logger.info({ msg: `OP001_03: Client secret is invalid` });
      throw new Error('Invalid client secret')
    }
    const apiKeyIsValid = apiKey === apiKeyEntry[0].apiKey;
    if (clientSecretIsValid && apiKeyIsValid) {
      logger.info({ msg: `OP001_04: API key validation successful` });
      return true
    }
    return false
  } catch (error) {
  }
}

module.exports = {
  verifyApiKey,
}
