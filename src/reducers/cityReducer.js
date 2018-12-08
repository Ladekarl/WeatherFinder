'use strict';

import * as types from '../actions/actionTypes';
import {sortMapByDistance} from '../shared/weatherHelper';

const initialState = {
  city: '',
  forecast: {},
  latitude: 0.0,
  longitude: 0.0,
  range: 50,
  desiredWeather: '1',
  nearbyCities: new Map(),
  nearbyCitiesShown: new Map(),
  fetching: false,
};

export default function cityReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.SELECT_CITY:
      return {
        ...state,
        city: action.city,
        latitude: action.latitude,
        longitude: action.longitude
      };
    case types.RECEIVE_WEATHER:
    case types.REQUEST_WEATHER:
      let fetching = true;
      if (types.RECEIVE_WEATHER) {
        fetching = false;
      }
      const nearbyCities = (new Map(state.nearbyCities)).set(action.city, action.weather);
      let nearbyCitiesShown = new Map(state.nearbyCitiesShown);
      if (action.shouldShowCity) {
        nearbyCitiesShown = sortMapByDistance(nearbyCitiesShown.set(action.city, action.weather));
      }
      return {
        ...state,
        nearbyCities: nearbyCities,
        nearbyCitiesShown: nearbyCitiesShown,
        fetching: fetching
      };
    case types.CHANGE_RANGE:
      return {
        ...state,
        range: action.range
      };
    case types.REQUEST_NEARBY_CITIES:
      return {
        ...state,
        city: action.city,
        latitude: action.latitude,
        longitude: action.longitude,
        range: action.range,
        nearbyCities: action.nearbyCities,
        nearbyCitiesShown: action.nearbyCitiesShown,
        fetching: true
      };
    case types.CHANGE_DESIRED_WEATHER:
      return {
        ...state,
        desiredWeather: action.desiredWeather,
        nearbyCitiesShown: action.nearbyCitiesShown
      };
    case types.REQUEST_WEATHER_FORECAST:
      return {
        ...state,
        fetching: true,
        forecast: action.forecast
      };
    case types.RECEIVE_WEATHER_FORECAST:
      return {
        ...state,
        fetching: false,
        forecast: action.forecast
      };
    default:
      return state;
  }
}