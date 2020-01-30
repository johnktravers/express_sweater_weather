class Forecast {
  constructor(geocode, data) {
    this.location = geocode.address;
    this.currently = this.currentWeather(data.currently);
    this.hourly = this.hourlyForecast(data.hourly);
    this.daily = this.dailyForecast(data.daily);
  }

  currentWeather(data) {
    return {
      summary: data.summary,
      icon: data.icon,
      precipIntensity: data.precipIntensity,
      precipProbability: data.precipProbability,
      temperature: data.temperature,
      humidity: data.humidity,
      pressure: data.pressure,
      windSpeed: data.windSpeed,
      windGust: data.windGust,
      windBearing: data.windBearing,
      cloudCover: data.cloudCover,
      visibility: data.visibility
    }
  }

  hourlyForecast(data) {
    return {
      summary: data.icon,
      icon: data.icon,
      data: data.data.slice(0, 8).map(hour => {
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

  dailyForecast(data) {
    return {
      summary: data.summary,
      icon: data.icon,
      data: data.data.map(day => {
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
}

module.exports = Forecast;
