const { SALT_LENGTH, CLIENT_ID_LENGTH } = require('../../../src/constants');
const { generateApiKey, createClientId, createHash, createClientSecret } = require('../../../src/lib/apikey');
const { addApiKey } = require('../../../src/lib/database/utils');
const decode = require('jwt-decode');

async function seedApiKey(userId = '12345') {
	try {
		const apiKey = generateApiKey(SALT_LENGTH);
		const clientId = createClientId(CLIENT_ID_LENGTH);
		const clientSecret = createClientSecret(SALT_LENGTH);
		const clientSecretHash = createHash(clientSecret);
		const entry = {
			userId,
			clientId,
			clientSecretHash,
			apiKey,
		};
		await addApiKey(entry);
		return {
			clientId,
			clientSecret,
			apiKey,
		};
	} catch (error) {
		console.trace(error);
	}
}

function decodeJwt(token) {
	return decode(token);
}

module.exports = {
	seedApiKey,
	decodeJwt,
}
