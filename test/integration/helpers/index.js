const decode = require('jwt-decode');

const {
  createHash,
  createClientSecret,
} = require('../../../src/lib/apikey');

const {
  addTeam,
  getTeamByName,
  getTeams,
  getTeam,
  addUserCreds,
} = require('../../../src/lib/database/utils');

const USER_ID = '12345';
const CLIENT_ID = 'leaderboard_client_Hack3r';

async function seedUserCreds(userIdentifier) {
  const userId = userIdentifier || USER_ID;
  const clientId = CLIENT_ID;
  const clientSecret = await createClientSecret();
  const clientSecretHash = await createHash(clientSecret);
  const entry = {
    userId,
    clientId,
    clientSecretHash,
  };
  await addUserCreds(entry);
  return {
    clientId,
    clientSecret,
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
  decodeJwt,
  USER_ID,
  CLIENT_ID,
  seedTeam,
  getTeamId,
  getTeams,
  getTeam,
  seedUserCreds,
};
