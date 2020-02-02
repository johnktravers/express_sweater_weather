const express = require('express');
const router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

const Geocode = require('../../../lib/objects/geocode');

router.post('/', async function(req, res, next) {
  let location = req.body.location || '';
  let apiKey = req.body.api_key || '';

  try {
    let user = await validateUser(apiKey);
    let geocode = await validateLocation(location);
    await createFavoriteLocation(user, geocode);
    res.status(200).json({
      message: `${geocode.address} has been added to your favorites`
    });
  } catch(error) {
    res.status(error.status).json({
      status: error.status,
      message: error.message
    });
  }
});

async function validateUser(apiKey) {
  let user = await database('users').where({ api_key: apiKey }).first();
  if (user) {
    return user;
  } else {
    return new Promise((resolve, reject) => {
      reject({ status: 401, message: 'Missing or invalid API key. Please try again.'});
    })
  }
};

async function validateLocation(location) {
  let geocodeData = await getGeocodeData(location);
  if (geocodeData) {
    let geocode = await new Geocode(geocodeData);
    return geocode;
  } else {
    return new Promise((resolve, reject) => {
      reject({ status: 400, message: 'Location not found. Please try again.'});
    })
  }
};

async function createFavoriteLocation(user, geocode) {
  let location_id = await database('locations').insert(
    {address: geocode.address, lat: geocode.lat, long: geocode.long}, 'id'
  );

  await database('user_locations').insert(
    {user_id: user.id, location_id: location_id[0]}
  );
};


// Google Geocoding API Call

function getGeocodeData(location) {
  var url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  var params = {
    address: location,
    key: process.env.GOOGLE_GEOCODING_API_KEY
  };
  url.search = new URLSearchParams(params).toString();

  let geocode_data = fetch(url)
    .then(response => response.json())
    .then(json => json.results[0])

  return geocode_data;
};

module.exports = router;
