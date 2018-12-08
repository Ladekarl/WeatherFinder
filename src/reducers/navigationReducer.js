'use strict';

import {NavigationActions} from 'react-navigation';
import {Stack} from '../router/navigationConfiguration';
import * as types from '../actions/actionTypes';

export default function navigationReducer(state, action) {
  switch (action.type) {
    case types.BACK: {
      const navigationAction = NavigationActions.back({});
      return Stack.router.getStateForAction(navigationAction, state);
    }
    case types.REQUEST_WEATHER_FORECAST: {
      const navigationAction = NavigationActions.navigate({
        routeName: 'WeatherForecastScreen',
        params: {
          city: action.city,
          weather: action.weather
        },
      });
      return Stack.router.getStateForAction(navigationAction, state);
    }
    default:
      return Stack.router.getStateForAction(action, state);
  }
}