const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');
const Geocode = require('../objects/geocode');


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

module.exports = {
  getGeocode: getGeocode
}
