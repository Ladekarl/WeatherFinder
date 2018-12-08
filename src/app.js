import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppNavigator, configureStore} from './router/stackNavigation';

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    );
  }
}