const express = require('express');
const router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

const Geocode = require('../../../lib/objects/geocode');

router.post('/', function(req, res, next) {
  let location = req.body.location;
  let apiKey = req.body.api_key;

  if (apiKey && location) {
    let geocode = getGeocode(location);

    database('users').where({ api_key: apiKey }).first()
      .then(user => {
        if (user) {
          return user;
        } else {
          let errorMsg = 'Invalid API Key. Please try again.';
          res.status(401).json({ errorMessage: errorMsg });
        }
      })
      // Validate location here like user above
      .then(user => createFavoriteLocation(user, geocode))
      .then(geocode => res.status(200).json({
        message: `${geocode.address} has been added to your favorites`
      }))
      .catch(error => {
        res.status(500).json({ errorMessage: error })
      });
  } else if (!apiKey || !user) {
      let errorMsg = 'Valid API key must be sent with this request.';
      res.status(401).json({ errorMessage: errorMsg });
  } else {
      let errorMsg = 'Invalid Location. Please try again.';
      res.status(400).json({ errorMessage: errorMsg });
  }
});


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

async function getGeocode(location) {
  try {
    let geocode_data = await getGeocodeData(location);
    let geocode = await new Geocode(geocode_data);
    return geocode;
  } catch(error) {
    console.log(error);
  }
}

function createFavoriteLocation(user, geocode) {
    geocode
      .then(geocode => {
      return database('locations').insert(
        {address: geocode.address, lat: geocode.lat, long: geocode.long}, 'id'
      );
    })
    .then(location_id => {
      return database('user_locations').insert(
        {user_id: user.id, location_id: location_id[0]}
      );
    })
    .catch(error => console.log(error));

    return geocode;
};

module.exports = router;
