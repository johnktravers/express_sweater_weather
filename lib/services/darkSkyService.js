const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');
const Forecast = require('../objects/forecast');


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

module.exports = {
  getForecast: getForecast
}
