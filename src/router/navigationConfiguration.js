import {createStackNavigator} from 'react-navigation';

import WeatherFinder from '../containers/weatherFinder';
import WeatherForecast from '../containers/weatherForecast';

const routeConfiguration = {
  WeatherFinderScreen: {
    screen: WeatherFinder,
    headerMode: 'none',
    header: null,
    navigationOptions: {
      header: null
    }
  },
  WeatherForecastScreen: {
    screen: WeatherForecast
  },
};

export const Stack = createStackNavigator(routeConfiguration);