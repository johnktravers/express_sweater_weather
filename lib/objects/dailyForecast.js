class DailyForecast {
  constructor(data) {
    this.summary = data.summary;
    this.icon = data.icon;
    this.data = this.dailyData(data.data);
  }

  dailyData(data) {
    return data.map(day => {
      return {
        time: day.time,
        summary: day.summary,
        icon: day.icon,
        sunriseTime: day.sunriseTime,
        sunsetTime: day.sunsetTime,
        precipIntensity: day.precipIntensity,
        precipIntensityMax: day.precipIntensityMax,
        precipIntensityMaxTime: day.precipIntensityMaxTime,
        precipProbability: day.precipProbability,
        precipType: day.precipType,
        temperatureHigh: day.temperatureHigh,
        temperatureLow: day.temperatureLow,
        humidity: day.humidity,
        pressure: day.pressure,
        windSpeed: day.windSpeed,
        windGust: day.windGust,
        cloudCover: day.cloudCover,
        visibility: day.visibility,
        temperatureMin: day.temperatureMin,
        temperatureMax: day.temperatureMax
      }
    })
  }
}

module.exports = DailyForecast;
