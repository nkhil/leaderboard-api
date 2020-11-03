const db = require('../lib/database/utils')

async function createTeam(req, res) {
  try {
    const team = req.body
    await db.addTeam(team)
    res.status(201).send()
  } catch (error) {
    if (error && error.code === 11000) {
      res.status(409).send()
    }
    console.log(error)
  }
}

async function getTeams(req, res) {
  try {
    const teams = await db.getTeams()
    console.log('TEAMS\n', teams)
    res.status(200).json(teams)
    console.log('sent!')
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createTeam,
  getTeams,
}
