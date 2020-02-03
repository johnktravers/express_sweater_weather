const express = require('express');
const router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

const Geocode = require('../../../lib/objects/geocode');
const Forecast = require('../../../lib/objects/forecast');
const CurrentForecast = require('../../../lib/objects/currentForecast');


router.get('/', async function(req, res, next) {
  let apiKey = req.body.api_key || '';

  try {
    let user = await validateUser(apiKey)
    let locations = await database.from('locations')
      .innerJoin('user_locations', 'user_locations.location_id', 'locations.id')
      .where('user_locations.user_id', user.id)

    let forecasts = await getFavoritesForecasts(locations);
    res.status(200).json({ favorite_locations: forecasts })
  } catch {
    res.status(404).json({ error: '404 Not Found' })
  }
});

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
  let location = await database('locations')
    .where({ lat: geocode.lat, long: geocode.long}).first();

  if (location) {
    var location_id = await [location.id];
  } else {
    var location_id = await database('locations').insert(
      {address: geocode.address, lat: geocode.lat, long: geocode.long}, 'id'
    );
  }

  let user_location = await database('user_locations')
    .where({ location_id: location_id[0], user_id: user.id }).first();

  if (!user_location) {
    await database('user_locations').insert(
      {user_id: user.id, location_id: location_id[0]}
    );
  }
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

// Dark Sky API Call

function getForecast(geocode) {
  let apiKey = process.env.DARK_SKY_API_KEY;
  let url = new URL(`https://api.darksky.net/forecast/${apiKey}/${geocode.lat},${geocode.long}`);

  let forecast = fetch(url)
    .then(response => response.json())
    .then(json => createCurrentForecast(geocode, json))
    .catch(error => console.log(error));

  return forecast;
};

function createCurrentForecast(geocode, forecast_data) {
  return {
    location: geocode.address,
    current_weather: new CurrentForecast(forecast_data.currently)
  };
}

async function getFavoritesForecasts(locations) {
  return Promise.all(
    locations.map(location => getForecast(location))
  );
}

module.exports = router;
