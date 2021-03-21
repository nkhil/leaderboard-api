const decode = require('jwt-decode');
const { SALT_LENGTH } = require('../../../src/constants');

const {
  generateApiKey,
  createHash,
  createClientSecret,
} = require('../../../src/lib/apikey');

const {
  addApiKey,
  addTeam,
  getTeamByName,
  getTeams,
  getTeam,
} = require('../../../src/lib/database/utils');

const USER_ID = '12345';
const CLIENT_ID = 'leaderboard_client_Hack3r';

async function seedApiKey(userIdentifier) {
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
}

function decodeJwt(token) {
  return decode(token);
}

async function seedTeam(team) {
  return addTeam(team);
}

async function getTeamId(teamName) {
  const [team] = await getTeamByName(teamName);
  // eslint-disable-next-line no-underscore-dangle
  return team._id;
}

module.exports = {
  seedApiKey,
  decodeJwt,
  USER_ID,
  CLIENT_ID,
  seedTeam,
  getTeamId,
  getTeams,
  getTeam,
};
