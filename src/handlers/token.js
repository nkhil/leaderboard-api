var jwt = require('jsonwebtoken');

async function generateToken(req, res) {
  const clientId = req.header('x-client-id'); // <<
  const authToken = jwt.sign(
    { clientId },
    'secret',
    {
      expiresIn: 60 * 60, // 60 minutes
      // algorithm: 'RS256'
    }
  );
  res.setHeader('Set-Cookie', [`authToken=${authToken}; HttpOnly`]);
  res.status(200).json({ authToken })
}

module.exports = {
  generateToken,
}