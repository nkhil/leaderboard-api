const logger = require('pino')();
const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../config');

function createToken(clientId) {
  const token = jwt.sign(
    { clientId },
    tokenSecret,
    {
      expiresIn: 120 * 60, // 120 minutes
      algorithm: 'HS256',
    },
  );
  return `Bearer ${token}`;
}

async function generateToken(req, res) {
  const clientId = req.headers['x-client-id'];
  logger.info({ msg: `Generating token for clientId ${clientId}` });
  const authToken = createToken(clientId);
  logger.info({ msg: 'authToken generated' });
  res.setHeader('Set-Cookie', [`authToken=${authToken}; HttpOnly`]);
  res.status(200).json({ authToken });
}

module.exports = {
  generateToken,
  createToken,
};
