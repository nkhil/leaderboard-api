var jwt = require('jsonwebtoken');
const logger = require('pino')();

function extractToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

function verifyToken(req) {
  try {
    logger.info({ msg: `Verifying bearer token` });
    const bearerToken = extractToken(req);
    const { clientId } = jwt.verify(bearerToken, 'secret');
    logger.info({ msg: `Token verified succcessfully` });
    req.clientId = clientId;
    return true;
  } catch (err) {
    logger.error({ msg: `ERROR: Token verification failed` });
    return false;
  }
}

module.exports = {
  verifyToken,
}