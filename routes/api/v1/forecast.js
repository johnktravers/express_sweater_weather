const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

const Geocode = require('../../../lib/objects/geocode');
const Forecast = require('../../../lib/objects/forecast');


router.get('/', function(req, res, next) {
  let location = req.query.location;
  let apiKey = req.body.api_key;

  if (apiKey && location) {
    let geocode = getGeocode(location)
      .then(geocode => getForecast(geocode))
      .then(forecast => res.status(200).json(forecast))
      .catch(error => {
        res.status(500).json({ errorMessage: error })
      });
  } else if (!apiKey) {
      let errorMsg = 'Valid API key must be sent with this request.';
      res.status(401).json({ errorMessage: errorMsg });
  } else {
      let errorMsg = 'Invalid Location. Please try again.';
      res.status(400).json({ errorMessage: errorMsg });
  }
});

// Dark Sky API Call

function getForecast(geocode) {
  var url = new URL(`https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${geocode.lat},${geocode.long}`);

  let forecast = fetch(url)
    .then(response => response.json())
    .then(json => createForecast(geocode, json))
    .catch(error => console.log(error));

  return forecast;
};

function createForecast(geocode, forecast_data) {
  return new Forecast(geocode, forecast_data);
}


// Google Geocoding API Call

function getGeocode(location) {
  var url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  var params = {
    address: location,
    key: process.env.GOOGLE_GEOCODING_API_KEY
  };
  url.search = new URLSearchParams(params).toString();

  let geocode = fetch(url)
    .then(response => response.json())
    .then(json => createGeocode(json.results[0]))
    .catch(error => console.log(error));

  return geocode;
};

function createGeocode(geocode_data) {
  return new Geocode(geocode_data);
};

module.exports = router;
