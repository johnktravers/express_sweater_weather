const express = require('express');
const router = express.Router();

const darkSkyService = require('../../../lib/services/darkSkyService');
const geocodingService = require('../../../lib/services/geocodingService');


router.get('/', function(req, res, next) {
  let location = req.query.location || '';
  let apiKey = req.body.api_key || '';

  if (apiKey && location) {
    let geocode = geocodingService.getGeocode(location)
      .then(geocode => darkSkyService.getForecast(geocode))
      .then(forecast => res.status(200).json(forecast))
      .catch(error => {
        res.status(500).json({ errorMessage: error })
      });
  } else if (!apiKey) {
      let errorMsg = 'Valid API key must be sent with this request.';
      res.status(401).json({ status: 401, message: errorMsg });
  } else {
      let errorMsg = 'Invalid Location. Please try again.';
      res.status(400).json({ status: 400, message: errorMsg });
  }
});

module.exports = router;
