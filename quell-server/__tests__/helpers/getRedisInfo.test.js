const request = require('supertest');
const app = require('../../test-config/test-server.js');
const QuellCache = require('../../src/quell');
const schema = require('../../test-config/testSchema');
const writeToCache = require('../../src/helpers/cacheHelpers')

const redisPort = 6379;

// tests pass locally, but time out in travis CI build...
xdescribe('server test for getRedisInfo', () => {
  const Quell = new QuellCache(schema, redisPort);

  app.use(
    '/redis',
    ...Quell.getRedisInfo({
      getStats: true,
      getKeys: true,
      getValues: true,
    })
  );

  const server = app.listen(3000, () => console.log('Listening on port 3000'));

  beforeAll(() => {
    const promise1 = new Promise((resolve, reject) => {
      resolve(
        writeToCache('country--1', {
          id: '1',
          capitol: { id: '2', name: 'DC' },
        })
      );
    });
    const promise2 = new Promise((resolve, reject) => {
      resolve(writeToCache('country--2', { id: '2' }));
    });
    const promise3 = new Promise((resolve, reject) => {
      resolve(writeToCache('country--3', { id: '3' }));
    });
    const promise4 = new Promise((resolve, reject) => {
      resolve(
        writeToCache('countries', [
          'country--1',
          'country--2',
          'country--3',
        ])
      );
    });
    return Promise.all([promise1, promise2, promise3, promise4]);
  });

  afterAll((done) => {
    server.close();
    Quell.redisCache.flushall();
    Quell.redisCache.quit(() => {
      console.log('closing redis server');
      done();
    });
  });

  it('responds with a 200 status code', async () => {
    const response = await request(app).get('/redis');
    expect(response.statusCode).toBe(200);
  });

  it('gets stats from redis cache', async () => {
    const response = await request(app).get('/redis');
    const redisStats = response.body.redisStats;
    expect(Object.keys(redisStats)).toEqual([
      'server',
      'client',
      'memory',
      'stats',
    ]);
  });

  it('gets keys from redis cache', async () => {
    const response = await request(app).get('/redis');
    const redisKeys = response.body.redisKeys;
    expect(redisKeys).toEqual([
      'country--2',
      'country--1',
      'countries',
      'country--3',
    ]);
  });

  it('gets values from redis cache', async () => {
    const response = await request(app).get('/redis');
    const redisValues = response.body.redisValues;
    expect(redisValues).toEqual([
      '{"id":"2"}',
      '{"id":"1","capitol":{"id":"2","name":"DC"}}',
      '["country--1","country--2","country--3"]',
      '{"id":"3"}',
    ]);
  });
});
