var request = require('supertest');
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('List favorites api endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table users cascade');
    await database.raw('truncate table locations cascade');

    let user = {name: 'Agnes', api_key: '12345'};
    let user_id = await database('users').insert(user, 'id');

    let location_1 = {address: 'Denver, CO', lat: '39.7392', long: '104.9903'};
    let location_2 = {address: 'Madrid, Spain', lat: '40.4168', long: '3.7038'};
    let location_ids = await database('locations').insert([location_1, location_2], 'id');

    await database('user_locations').insert([
      {user_id: user_id[0], location_id: location_ids[0]},
      {user_id: user_id[0], location_id: location_ids[1]}
    ]);
  });

  afterEach(async () => {
    await database.raw('truncate table users cascade');
    await database.raw('truncate table locations cascade');
  });

  test('It sees a list of all favorite locations and current weather', async () => {
    const res = await request(app)
      .get('/api/v1/favorites')
      .send({api_key: '12345'})
      .type('form');

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('favorite_locations')

    let locations = res.body.favorite_locations;

    expect(locations.length).toBe(2)

    expect(locations[0]).toHaveProperty('location')
    expect(locations[0].location).toBe('Denver, CO')

    expect(locations[0]).toHaveProperty('current_weather')
    expect(Object.keys(locations[0].current_weather).length).toEqual(12)

    expect(locations[1]).toHaveProperty('location')
    expect(locations[1].location).toBe('Madrid, Spain')

    expect(locations[1]).toHaveProperty('current_weather')
    expect(Object.keys(locations[1].current_weather).length).toEqual(12)
  });

  test('It sees an error message if API key is invalid', async () => {
    const res = await request(app)
      .get('/api/v1/favorites')
      .send({api_key: 'sagkjb24nlkj53'})
      .type('form');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(401);
    expect(res.body.message).toBe('Missing or invalid API key. Please try again.')
  });

  test('It sees an error message if API key is missing', async () => {
    const res = await request(app)
      .get('/api/v1/favorites');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(401);
    expect(res.body.message).toBe('Missing or invalid API key. Please try again.')
  });
})
