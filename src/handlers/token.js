var jwt = require('jsonwebtoken');
const logger = require('pino')();

async function generateToken(req, res) {
  logger.info({ msg: `Generating token` })
  const clientId = req.headers['x-client-id'];
  logger.info({ msg: `Generating token for clientId ${clientId}` })
  const authToken = jwt.sign(
    { clientId },
    'secret',
    {
      expiresIn: 60 * 60, // 60 minutes
      // algorithm: 'RS256'
    }
  );
  logger.info({ msg: `authToken generated` })
  res.setHeader('Set-Cookie', [`authToken=${authToken}; HttpOnly`]);
  res.status(200).json({ authToken })
}

module.exports = {
  generateToken,
}