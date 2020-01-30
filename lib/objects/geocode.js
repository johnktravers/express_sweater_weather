class Geocode {
  constructor(data) {
    this.address = data.formatted_address;
    this.lat = data.geometry.location.lat;
    this.long = data.geometry.location.lng;
  }
}

module.exports = Geocode;
