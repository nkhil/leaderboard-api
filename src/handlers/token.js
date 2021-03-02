var jwt = require('jsonwebtoken');
const logger = require('pino')();

function createJwtToken(clientId) {
	const token = jwt.sign(
		{ clientId },
		'secret',
		{
			expiresIn: 60 * 60, // 60 minutes
			// algorithm: 'RS256'
		}
	);
	return `Bearer ${token}`;
}

async function generateToken(req, res) {
	const clientId = req.headers['x-client-id'];
	logger.info({ msg: `Generating token for clientId ${clientId}` })
	const authToken = createJwtToken(clientId);
	logger.info({ msg: `authToken generated` });
	res.setHeader('Set-Cookie', [`authToken=${authToken}; HttpOnly`]);
	res.status(200).json({ authToken });
}

module.exports = {
	generateToken,
	createJwtToken,
}