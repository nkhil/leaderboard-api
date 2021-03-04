const init = require('../../src')
const supertest = require('supertest')
const database = require('../../src/lib/database')
const { 
	seedApiKey, 
	seedTeam, 
	decodeJwt, 
	getTeamId,
	getTeams, 
	CLIENT_ID,
} = require('./helpers');
const { ApiKeyModel } = require('../../src/lib/model/apiKey');
const { createJwtToken } = require('../../src/handlers/token');
const { TeamModel } = require('../../src/lib/model/teams');
const { LeaderboardModel } = require('../../src/lib/model/leaderboard');

const SOME_TEAM_NAME = 'Seattle Seahawks';
const LEADERBOARD_NAME = 'Average Joes';

describe('Integration tests', () => {
	let request;

	beforeAll(async () => {
		const app = await init();
		await LeaderboardModel.deleteMany({});
		await ApiKeyModel.deleteMany({});
		await TeamModel.deleteMany({});
		request = supertest(app);
	});
	
	afterEach(async () => { // Clean db between tests
		await LeaderboardModel.deleteMany({});
		await ApiKeyModel.deleteMany({});
		await TeamModel.deleteMany({});
	});
	
	afterAll(async (done) => {
		await LeaderboardModel.deleteMany({});
		await ApiKeyModel.deleteMany({});
		await TeamModel.deleteMany({});
		await database.disconnect();
		done();
	});

	describe('Liveness route 🟢', () => {
		it('checks liveness of the service', async done => {
			const res = await request.get('/liveness')
			expect(res.status).toBe(200)
			const parsedResponse = JSON.parse(res.text)
			expect(parsedResponse).toEqual({ status: 'OK' })
			done()
		});
	});

	describe('Token routes 🎟️', () => {

		describe('GET /token', () => {
			it('returns a valid token with the right credentials', async done => {
				const { clientId, clientSecret, apiKey } = await seedApiKey();
				const res = await request.get('/token')
					.set('x-client-id', clientId)
					.set('x-client-secret', clientSecret)
					.set('x-api-key', apiKey)
				expect(res.status).toBe(200);
				const parsedResponse = JSON.parse(res.text);
				const { clientId: id } = decodeJwt(parsedResponse.authToken);
				expect(id.slice(0, 18)).toBe('leaderboard_client');
				done();
			});
	
			it('returns a 401 response for invalid credentials', async done => {
				const res = await request.get('/token')
					.set('x-client-id', 'wrong_client_id')
					.set('x-client-secret', 'wrong_secret')
					.set('x-api-key', 'wrong_api_key');
				expect(res.status).toBe(401);
				done();
			});
	
			it('returns a 401 response for missing credentials', async done => {
				const res = await request.get('/token')
				expect(res.status).toBe(401);
				done();
			});
		})
	});

	describe('Team routes 🧍‍♀️🧍‍♂️🧍‍♀️🧍‍♂️', () => {

		describe('POST /team', () => {

			it('can create a new team', async done => {
				const token = createJwtToken(CLIENT_ID);
				const res = await request.post('/team')
					.set('Authorization', token)
					.send({
						teamName: SOME_TEAM_NAME,
					});
				expect(res.status).toBe(201);
				done();
			});
	
			it('returns a 401 response for invalid bearer token', async done => {
				const res = await request.post('/team')
					.set('Authorization', 'Bearer invalid_token')
					.send({
						teamName: SOME_TEAM_NAME,
					});
				expect(res.status).toBe(401);
				done();
			});
	
			it('returns a 401 response for missing bearer token', async done => {
				const res = await request.post('/team')
					.send({
						teamName: SOME_TEAM_NAME,
					});
				expect(res.status).toBe(401);
				done();
			});
		});

		describe('GET /team', () => {

			it('can get teams belonging to the correct clientId', async done => {
				await seedTeam({
					clientId: CLIENT_ID,
					teamName: SOME_TEAM_NAME,
				});
				const token = createJwtToken(CLIENT_ID);
				const res = await request.get('/team')
					.set('Authorization', token);
				expect(res.status).toBe(200);
				const [parsedResponse] = JSON.parse(res.text);
				expect(parsedResponse.teamName).toBe(SOME_TEAM_NAME);
				expect(Boolean(parsedResponse['_id'])).toBe(true);
				expect(parsedResponse['clientId'].slice(0, 18)).toBe('leaderboard_client');
				done();
			});
	
			it('returns a 401 response for missing bearer token', async done => {
				const res = await request.get('/team');
				expect(res.status).toBe(401);
				done();
			});
	
			it('returns a 401 response for incorrect bearer token', async done => {
				const res = await request.get('/team')
					.set('Aythorization', 'some_wrong_token');
				expect(res.status).toBe(401);
				done();
			});
		});

		describe('DELETE /team/:id', () => {
			it('can successfully delete a team', async done => {
				await seedTeam({
					clientId: CLIENT_ID,
					teamName: SOME_TEAM_NAME,
				});
				const token = createJwtToken(CLIENT_ID);
				const teamId = await getTeamId(SOME_TEAM_NAME);
				const res = await request.delete(`/team/${teamId}`)
					.set('Authorization', token);
				expect(res.status).toBe(204);
				const teamsInDb = await getTeams(CLIENT_ID);
				expect(teamsInDb.length).toBe(0);
				done();
			});

			it('returns a 401 response for incorrect bearer token', async done => {
				const res = await request.delete('/team/00000')
					.set('Authorization', 'bad_token');
				expect(res.status).toBe(401);
				done();
			});

			it('returns a 401 response for missing bearer token', async done => {
				const res = await request.delete('/team/00000');
				expect(res.status).toBe(401);
				done();
			});
		});

		describe('PUT /team', () => {
			it('can update a team successfully', async done => {
				const newTeamName = 'Green Bay Packers';
				await seedTeam({
					clientId: CLIENT_ID,
					teamName: SOME_TEAM_NAME,
				});
				const token = createJwtToken(CLIENT_ID);
				const teamId = await getTeamId(SOME_TEAM_NAME);
				const res = await request.put(`/team/${teamId}`)
					.set('Authorization', token)
					.send({
						teamName: newTeamName,
					});
				expect(res.status).toBe(201);
				done();
			});

			it('returns 400 if teamId is incorrect', async done => {
				await seedTeam({
					clientId: CLIENT_ID,
					teamName: SOME_TEAM_NAME,
				});
				const token = createJwtToken(CLIENT_ID);
				const res = await request.put('/team/99999')
					.set('Authorization', token)
					.send({
						teamName: SOME_TEAM_NAME,
					});
				expect(res.status).toBe(400);
				done();
			});

			it('returns 400 if no teams exist for a client', async done => {
				const token = createJwtToken(CLIENT_ID);
				const res = await request.put('/team/99999')
					.set('Authorization', token)
					.send({
						teamName: SOME_TEAM_NAME,
					});
				expect(res.status).toBe(400);
				done();
			});

			it('returns 401 if token is incorrect', async done => {
				const res = await request.put('/team/99999')
					.set('Authorization', 'wrong_token')
					.send({
						teamName: SOME_TEAM_NAME,
					});
				expect(res.status).toBe(401);
				done();
			});

			it('returns 401 if token is missing', async done => {
				const res = await request.put('/team/99999')
					.send({
						teamName: SOME_TEAM_NAME,
					});
				expect(res.status).toBe(401);
				done();
			});
		});

	});

	describe('Leaderboard routes 🏅', () => {
		describe('POST /leaderboard', () => {
			it('can create new leaderboards', async done => {
				const token = createJwtToken(CLIENT_ID);
				const res = await request.post('/leaderboard')
					.set('Authorization', token)
					.send({
						name: LEADERBOARD_NAME,
						clientId: CLIENT_ID,
					});
				expect(res.status).toBe(200);
				const parsedResponse = JSON.parse(res.text);
				expect(parsedResponse.name).toBe(LEADERBOARD_NAME);
				expect(parsedResponse.clientId).toBe(CLIENT_ID);
				done();
			});
	
			it('returns a 400 for incorrect request body', async done => {
				const token = createJwtToken(CLIENT_ID);
				const res = await request.post('/leaderboard')
					.set('Authorization', token)
					.send({
						name: LEADERBOARD_NAME,
						clientId: CLIENT_ID,
						someWrongProp: 'foo',
					});
				expect(res.status).toBe(400);
				done();
			});
	
			it('returns a 400 for missing required props from request body', async done => {
				const token = createJwtToken(CLIENT_ID);
				const res = await request.post('/leaderboard')
					.set('Authorization', token)
					.send({
						name: LEADERBOARD_NAME,
					});
				expect(res.status).toBe(400);
				done();
			});
	
			it('returns a 401 for missing token', async done => {
				const res = await request.post('/leaderboard')
					.send({
						name: LEADERBOARD_NAME,
					});
				expect(res.status).toBe(401);
				done();
			});
	
			it('returns a 401 for incorrect token', async done => {
				const res = await request.post('/leaderboard')
					.set('Authorization', 'wrong_token')
					.send({
						name: LEADERBOARD_NAME,
					});
				expect(res.status).toBe(401);
				done();
			});
		});
	});

});

