const init = require('../../src')
const supertest = require('supertest')
const database = require('../../src/lib/database')


describe('Integration tests', () => {
  let request;

  beforeAll(async () => {
    const app = await init();
    request = supertest(app);
  })

  afterAll(async (done) => {
    await database.disconnect();
    done();
  })

  describe('/liveness', () => {
    it('returns a 200 response with right params', async done => {
      const res = await request.get('/liveness')
      expect(res.status).toBe(200)
      const parsedResponse = JSON.parse(res.text)
      expect(parsedResponse).toEqual({ status: 'OK' })
      done()
    })
  })

})

