'use strict';

import * as types from './actionTypes';
import Config from 'react-native-config'
import {shouldPresentWeather} from '../shared/weatherHelper';
import {Alert} from 'react-native';
import {sortMapByDistance} from '../shared/weatherHelper';

export const selectCity = (city, latitude, longitude, range, desiredWeather) => {
  return dispatch => {
    dispatch(fetchNearbyCitiesWeather(city, latitude, longitude, range, desiredWeather));
    return {
      type: types.SELECT_CITY,
      city,
      longitude,
      latitude
    }
  }
};

function requestWeather(city, desiredWeather) {
  return {
    type: types.REQUEST_WEATHER,
    city,
    nearbyCitiesShown: new Map()
  }
}

function requestNearbyCities(city, latitude, longitude, range) {
  return {
    type: types.REQUEST_NEARBY_CITIES,
    city,
    latitude,
    longitude,
    range,
    nearbyCities: new Map(),
    nearbyCitiesShown: new Map()
  }
}

function receiveWeather(city, json, desiredWeather) {
  return {
    type: types.RECEIVE_WEATHER,
    city,
    shouldShowCity: shouldPresentWeather(desiredWeather, json),
    weather: json
  }
}

function fetchWeatherForNearbyCity(nearbyCity, desiredWeather) {
  return dispatch => {
    dispatch(requestWeather(nearbyCity, desiredWeather));
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${nearbyCity.name}&APPID=${Config.OWM_API_KEY}`)
      .then(response => response.json())
      .then(json => dispatch(receiveWeather(nearbyCity, json, desiredWeather)))
      .catch(handleErrors);
  }
}


export const fetchNearbyCitiesWeather = (city, latitude, longitude, range, desiredWeather) => {
  const responseStyle = 'short';
  const citySize = 'cities15000';
  const maxRows = 99;
  return dispatch => {
    dispatch(requestNearbyCities(city, latitude, longitude, range));
    fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&style=${responseStyle}&cities=${citySize}&radius=${range}&maxRows=${maxRows}&username=${Config.GEONAMES_USERNAME}`)
      .then(response => response.json())
      .then(json => {
        let cities = json.geonames;
        for (let i = 0; i < cities.length; i++) {
          let city = cities[i];
          dispatch(fetchWeatherForNearbyCity(city, desiredWeather))
        }
      })
      .catch(handleErrors);
  }
};

export const changeRange = (range) => {
  return {
    type: types.CHANGE_RANGE,
    range
  }
};

export const changeDesiredWeather = (desiredWeather, nearbyCities) => {
  return {
    type: types.CHANGE_DESIRED_WEATHER,
    desiredWeather: desiredWeather,
    nearbyCitiesShown: getNearbyCitiesToShow(desiredWeather, nearbyCities)
  }
};

export const getWeatherForecast = (city, weather) => {
  return dispatch => {
    dispatch(requestWeatherForecast(city, weather));
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city.name},${city.countryCode}&appid=${Config.OWM_API_KEY}`)
      .then(response => response.json())
      .then(json => dispatch(receiveWeatherForecast(city, json)))
      .catch(handleErrors);
  }
};

function requestWeatherForecast(city, weather) {
  return {
    type: types.REQUEST_WEATHER_FORECAST,
    city,
    weather,
    forecast: {}
  }
}

function receiveWeatherForecast(city, forecast) {
  return {
    type: types.RECEIVE_WEATHER_FORECAST,
    city,
    forecast
  }
}

function getNearbyCitiesToShow(desiredWeather, nearbyCities) {
  let nearbyCitiesToShow = new Map(nearbyCities);
  nearbyCitiesToShow.forEach((weather, city) => {
    if (!shouldPresentWeather(desiredWeather, weather)) {
      nearbyCitiesToShow.delete(city);
    }
  });

  return sortMapByDistance(nearbyCitiesToShow);
}

function checkErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function handleErrors(error) {
  Alert.alert(error)
}