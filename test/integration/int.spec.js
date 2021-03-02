const init = require('../../src')
const supertest = require('supertest')
const database = require('../../src/lib/database')
const { seedApiKey, decodeJwt } = require('./helpers');
const { ApiKeyModel } = require('../../src/lib/model/apiKey');

describe('Integration tests', () => {
	let request;

	beforeAll(async () => {
		const app = await init();
		await ApiKeyModel.deleteMany({});
		request = supertest(app);
	});

	afterAll(async (done) => {
		await database.disconnect();
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
				.set('x-client-id', '12345')
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

})

