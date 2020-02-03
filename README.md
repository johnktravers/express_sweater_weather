# Express Sweater Weather

[![Build Status](https://travis-ci.com/johnktravers/express_sweater_weather.svg?branch=master)](https://travis-ci.com/johnktravers/express_sweater_weather)

## Introduction

This application is a backend service built in Node.js and Express to expose endpoints related to geographical locations and weather. A user can use the API key attached to their account to see the forecast for a given location, add a location to their list of favorites, see the current weather at all of their favorite locations, and remove a favorite location.

## Initial Setup

This application is deployed to Heroku. You can find it [here](https://express-sweater-weather-jtravs.herokuapp.com/).

In order to setup this application locally, you will need to use Node Package Manager to install dependencies using the following command:

```
npm install

```

You will also have to setup a development database in PostgreSQL using the following commands:

```
psql
CREATE DATABASE sweater_weather_dev;
\q

knex migrate:latest
knex seed:run
```

## Testing Instructions

In order to run tests locally, you will first need to setup a test database. You can do so using the following commands:

```
psql
CREATE DATABASE sweater_weather_test;
\q

knex migrate:latest --env test
```

After setting up the test database, you can run the tests using this command:

```
npm test
```

## Application Instructions

This application consists of four endpoints, each of which requires a body and the following headers:

```
Content-Type: application/json
Accept: application/json
```

#### 1. `GET /api/v1/forecast?location=<LOCATION>`

This endpoint requires a body containing your API key in JSON format (`{ api_key: <API_KEY> }`). It returns a a weather forecast of the given location, with current weather, hourly forecast data for the next 8 hours, and daily weather data for the next 7 days.

#### 2. `POST /api/v1/favorites`

This endpoint requires a body containing your API key and a location in JSON format (`{ api_key: <API_KEY>, location: <LOCATION> }`). It adds the given location to your list of favorites and returns a JSON response indicating the successful addition. You can then use the next endpoint to see all of your favorite locations.

#### 3. `GET /api/v1/favorites`

This endpoint requires a body containing your API key in JSON format (`{ api_key: <API_KEY> }`). It returns all of your favorite locations and their current weather, including temperature, a summary of the weather, humidity, visibility, and other data attributes.

#### 4. `DELETE /api/v1/favorites`

This endpoint requires a body containing your API key and a location in JSON format (`{ api_key: <API_KEY>, location: <LOCATION> }`). It deletes the given location from your list of favorites.

## Schema Design

The schema for this application consists of two tables that have a many-to-many relationship with each other: users and locations. The locations table has address, latitude, and longitude columns. The latitude and longitude, together, are guaranteed to be unique.

## Tech Stack

This application uses Node.js and the Express framework for backend scaffolding, Knex for an ORM, and Jest for testing.

## Core Contributors

Because this was a solo project, I (John Travers), am the only contributor in terms of written code. However, [Ryan Hantak](https://github.com/rhantak) provided advice and direction through PR reviews.
