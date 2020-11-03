const Model = require('../model/teams');

async function addTeam(team) {
  try {
    return await Model.create(team);
  } catch (err) {
    console.log(`Error: ${err}`);
    throw err;
  }
}

async function getTeams() {
  try {
    return await Model.find()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addTeam,
  getTeams,
}
