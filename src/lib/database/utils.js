const { TeamModel } = require('../model/teams');
const { UserModel } = require('../model/user');
const { ApiKeyModel } = require('../model/apiKey');

async function addTeam(team) {
	try {
		return await TeamModel.create(team);
	} catch (error) {
		console.log(`erroror: ${error}`);
		throw error;
	}
}

async function getTeams(clientId) {
	try {
		return await TeamModel.find({ clientId }).exec()
	} catch (error) {
		console.log(error)
	}
}

async function getTeam(teamId) {
	try {
		return await TeamModel.findById(teamId).exec();
	} catch (error) {
		console.log('Error getting team')
		console.log(error)
	}
}

async function addUser(user) {
	try {
		return await UserModel.create(user)
	} catch (error) {
		console.log('\nERROR CREATING USER\n')
		console.log('addUser -> error', error)
		throw error
	}
}

async function findUserByEmail(email) {
	try {
		return await UserModel.find({ email }).exec()
	} catch (error) {
		console.log('findUserByEmail -> error', error)
	}
}

async function addApiKey(apiKey) {
	try {
		return await ApiKeyModel.create(apiKey)
	} catch (error) {
		console.log('Error creating API Key')
		throw error
	}
}

async function findApiKeyHashBySalt(salt) {
	try {
		return await ApiKeyModel.find({ salt })
	} catch (error) {
		console.log('findApiKeyHashBySalt -> error', error)
	}
}

async function findApiKeyByTeamId(teamId) {
	try {
		return await ApiKeyModel.find({ teamId })
	} catch (error) {
		console.log('findApiKeyByTeamId -> error', error)
	}
}

async function findApiKeyByClientId(clientId, apiKey) {
	try {
		return await ApiKeyModel.find({ clientId, apiKey })
	} catch (error) {
		console.log('🚀 ~ file: utils.js ~ line 79 ~ findApiKeyByUserId ~ error', error)
		console.log('/n Error findApiKeyByUserId')
	}
}

function createClientSecret(length) {
	return generateSalt(length)
}

module.exports = {
	addTeam,
	getTeams,
	getTeam,
	addUser,
	addApiKey,
	findUserByEmail,
	findApiKeyHashBySalt,
	findApiKeyByTeamId,
	findApiKeyByClientId,
	createClientSecret,
}
