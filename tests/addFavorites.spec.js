var request = require('supertest');
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('New favorites api endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table users cascade');
    await database.raw('truncate table locations cascade');

    let user = { name: 'Agnes', api_key: '12345'}
    await database('users').insert(user);
  });

  afterEach(async () => {
    await database.raw('truncate table users cascade');
    await database.raw('truncate table locations cascade');
  });

  test('It can create a new favorite with api key and location', async () => {
    const res = await request(app)
      .post('/api/v1/favorites')
      .send({api_key: '12345', location: 'sevilla, spain'})
      .type('form');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Seville, Spain has been added to your favorites');
  });

  test('It sees an error message if api key is missing', async () => {
    const res = await request(app)
      .post('/api/v1/favorites')
      .send({location: 'sevilla, spain'})
      .type('form');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(401);
    expect(res.body.message).toBe('Missing or invalid API key. Please try again.')
  });

  test('It sees an error message if api key is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/favorites')
      .send({api_key: 'sg2o3u4thrkjng9842', location: 'sevilla, spain'})
      .type('form');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(401);
    expect(res.body.message).toBe('Missing or invalid API key. Please try again.')
  });

  test('It sees an error if the location is missing', async () => {
    const res = await request(app)
      .post('/api/v1/favorites')
      .send({api_key: '12345'})
      .type('form');

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(400);
      expect(res.body.message).toBe('Location not found. Please try again.')

  });

  test('It sees an error if the location is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/favorites')
      .send({api_key: '12345', location: 'sdkjglhaitgjkb'})
      .type('form');

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(400);
      expect(res.body.message).toBe('Location not found. Please try again.')

  });
});
