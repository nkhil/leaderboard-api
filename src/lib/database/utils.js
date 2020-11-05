const { TeamModel } = require('../model/teams');
const { UserModel } = require('../model/user')
const { ApiKeyModel } = require('../model/apiKey')

async function addTeam(team) {
  try {
    return await TeamModel.create(team);
  } catch (error) {
    console.log(`erroror: ${error}`);
    throw error;
  }
}

async function getTeams() {
  try {
    return await TeamModel.find()
  } catch (error) {
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

module.exports = {
  addTeam,
  getTeams,
  addUser,
  addApiKey,
  findUserByEmail,
  findApiKeyHashBySalt,
}
