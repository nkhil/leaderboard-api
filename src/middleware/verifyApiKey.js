const logger = require('@subgeniuscorp/logger');
const { findUserCredsByClientId } = require('../lib/database/utils');
const { validateHash } = require('../lib/apikey');

function getCredentialsFromHeaders(req) {
  const clientId = req.headers['x-client-id'];
  const clientSecret = req.headers['x-client-secret'];
  return {
    clientId,
    clientSecret,
  };
}

async function verifyApiKey(req) {
  try {
    logger.info({ msg: 'OP001_01: Verifying API key' });
    const { clientId, clientSecret } = getCredentialsFromHeaders(req);
    const userCreds = await findUserCredsByClientId(clientId);
    if (!userCreds.length) {
      logger.info({ msg: `OP001_02: No credentials found for clientId ${clientId}` });
      return false;
    }
    const [{ clientSecretHash }] = userCreds;
    const clientSecretIsValid = await validateHash(clientSecretHash, clientSecret);
    if (!clientSecretIsValid) {
      logger.info({ msg: 'OP001_03: Client secret is invalid' });
      return false;
    }
    if (clientSecretIsValid) {
      logger.info({ msg: 'OP001_04: API key validation successful' });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

module.exports = {
  verifyApiKey,
};
