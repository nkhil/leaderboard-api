const { SALT_LENGTH, CLIENT_ID_LENGTH } = require('../../../src/constants');
const { generateApiKey, createClientId, createHash, createClientSecret } = require('../../../src/lib/apikey');
const { addApiKey, addTeam } = require('../../../src/lib/database/utils');
const decode = require('jwt-decode');

const USER_ID = '12345';
const CLIENT_ID = 'leaderboard_client_Hack3r';

async function seedApiKey(userIdentifier) {
	try {
		const userId = userIdentifier || USER_ID;
		const apiKey = generateApiKey(SALT_LENGTH);
		const clientId = CLIENT_ID;
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

async function seedTeam(team) {
	try {
		return await addTeam(team);
	} catch (error) {
		console.trace(error);
	}
}

module.exports = {
	seedApiKey,
	decodeJwt,
	USER_ID,
	CLIENT_ID,
	seedTeam,
}
