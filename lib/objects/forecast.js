const CurrentForecast = require('./currentForecast');
const HourlyForecast = require('./hourlyForecast');
const DailyForecast = require('./dailyForecast');

class Forecast {
  constructor(geocode, data) {
    this.location = geocode.address;
    this.currently = new CurrentForecast(data.currently);
    this.hourly = new HourlyForecast(data.hourly);
    this.daily = new DailyForecast(data.daily);
  }
}

module.exports = Forecast;
