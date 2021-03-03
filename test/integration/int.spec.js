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

const SOME_TEAM_NAME = 'some team name';

describe('Integration tests', () => {
	let request;

	beforeAll(async () => {
		const app = await init();
		await ApiKeyModel.deleteMany({});
		await TeamModel.deleteMany({});
		request = supertest(app);
	});

	afterEach(async () => { // Clean db between tests
		await ApiKeyModel.deleteMany({});
		await TeamModel.deleteMany({});
	});

	afterAll(async (done) => {
		await database.disconnect();
		await ApiKeyModel.deleteMany({});
		await TeamModel.deleteMany({});
		done();
	});

	describe('GET /liveness', () => {
		it('checks liveness of the service', async done => {
			const res = await request.get('/liveness')
			expect(res.status).toBe(200)
			const parsedResponse = JSON.parse(res.text)
			expect(parsedResponse).toEqual({ status: 'OK' })
			done()
		});
	});

	describe('GET /token', () => {

		afterEach(async () => {
			await ApiKeyModel.deleteMany({});
		});

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
	});

	describe('/team', () => {

		describe('POST /team', () => {

			it('can create a new team', async done => {
				const token = createJwtToken(CLIENT_ID);
				const res = await request.post('/team')
					.set('Authorization', token)
					.send({
						teamName: 'Seattle Seahawks',
					});
				expect(res.status).toBe(201);
				done();
			});
	
			it('returns a 401 response for invalid bearer token', async done => {
				const res = await request.post('/team')
					.set('Authorization', 'Bearer invalid_token')
					.send({
						teamName: 'Seattle Seahawks',
					});
				expect(res.status).toBe(401);
				done();
			});
	
			it('returns a 401 response for missing bearer token', async done => {
				const res = await request.post('/team')
					.send({
						teamName: 'Seattle Seahawks',
					});
				expect(res.status).toBe(401);
				done();
			});
		});

		describe('GET /team', () => {

			it('can get teams belonging to the correct clientId', async done => {
				const seattleSeahawks = 'Seattle Seahawks'
				await seedTeam({
					clientId: CLIENT_ID,
					teamName: seattleSeahawks,
				});
				const token = createJwtToken(CLIENT_ID);
				const res = await request.get('/team')
					.set('Authorization', token);
				expect(res.status).toBe(200);
				const [parsedResponse] = JSON.parse(res.text);
				expect(parsedResponse.teamName).toBe(seattleSeahawks);
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
				const seattleSeahawks = 'Seattle Seahawks'
				await seedTeam({
					clientId: CLIENT_ID,
					teamName: seattleSeahawks,
				});
				const token = createJwtToken(CLIENT_ID);
				const teamId = await getTeamId(seattleSeahawks);
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
				const teamName = 'Seattle Seahawks';
				const newTeamName = 'Green Bay Packers';
				await seedTeam({
					clientId: CLIENT_ID,
					teamName,
				});
				const token = createJwtToken(CLIENT_ID);
				const teamId = await getTeamId(teamName);
				const res = await request.put(`/team/${teamId}`)
					.set('Authorization', token)
					.send({
						teamName: newTeamName,
					});
				expect(res.status).toBe(201);
				done();
			});

			it('returns 400 if teamId is incorrect', async done => {
				const teamName = 'Seattle Seahawks';
				await seedTeam({
					clientId: CLIENT_ID,
					teamName,
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

});

