class HourlyForecast {
  constructor(data) {
    this.summary = data.summary;
    this.icon = data.icon;
    this.data = this.hourlyData(data.data);
  }

  hourlyData(data) {
    data.slice(0, 8).map(hour => {
      return {
        time: hour.time,
        summary: hour.summary,
        icon: hour.icon,
        precipIntensity: hour.precipIntensity,
        precipProbability: hour.precipProbability,
        temperature: hour.temperature,
        humidity: hour.humidity,
        pressure: hour.pressure,
        windSpeed: hour.windSpeed,
        windGust: hour.windGust,
        windBearing: hour.windBearing,
        cloudCover: hour.cloudCover,
        visibility: hour.visibility
      }
    })
  }
}

module.exports = HourlyForecast;
