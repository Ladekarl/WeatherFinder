'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import * as cityActionCreators from '../actions/cityActions'
import * as navigationActionCreators from '../actions/navigationActions'
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import CityInput from '../components/top/cityInput';
import WeatherDisplay from '../components/weatherDisplay';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import WeatherMapView from '../components/map/weatherMapView';
import Config from 'react-native-config'
import Geocoder from 'react-native-geocoder';
import strings from '../shared/i18n/strings';
import colors from '../shared/styles/colors';
import NoContentView from '../components/noContentView';
import {createFeaturePoints} from '../shared/weatherMapHelper';
import StatusBar from '../components/top/statusBar';

Geocoder.fallbackToGoogle(Config.GOOGLE_API_KEY);

class WeatherFinder extends Component {

  constructor(props) {
    super(props);
  }

  tabsRef;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        Geocoder.geocodePosition({lat, lng}).then(res => {
          this.props.cityActions.selectCity(res[0].locality, lat, lng, this.props.state.range, this.props.state.desiredWeather)
        })
      }
    );
  }

  _renderNoContentView = () => {
    return (
      <NoContentView key='noContent'/>
    )
  };

  _renderActivityIndicatorView = (state) => {
    return(
      <View
        key='activityIndicator'
        style={styles.activityIndicatorContainer}>
        <ActivityIndicator
          style={{opacity: (state.fetching && this.tabsRef.state.currentPage !== 0 ? 1.0 : 0.0)}}
          animating={true}
          color={colors.mainColor}
          size='large'/>
      </View>
    )
  };

  _onRefresh() {
    this.props.cityActions.fetchNearbyCitiesWeather(
      this.props.state.city,
      this.props.state.latitude,
      this.props.state.longitude,
      this.props.state.range,
      this.props.state.desiredWeather)
  }

  render() {
    const {state, cityActions} = this.props;

    let noContentView = [];
    if (state.nearbyCitiesShown.size < 1 && !state.fetching) {
      noContentView.push(this._renderNoContentView(state));
    }

    let activityIndicatorView = [];
    if (state.fetching) {
      activityIndicatorView.push(this._renderActivityIndicatorView(state));
    }

    return (
      <View style={styles.container}>
        <StatusBar/>
        <View style={styles.topContainer}>
          <CityInput
            city={state.city}
            range={state.range}
            desiredWeather={state.desiredWeather}
            latitude={state.latitude}
            longitude={state.longitude}
            nearbyCities={state.nearbyCities}
            {...cityActions}/>
        </View>
        <ScrollableTabView
          style={styles.centerContainer}
          ref={(tabRef) => {
            this.tabsRef = tabRef;
          }}
          tabBarBackgroundColor={colors.mainColor}
          tabBarActiveTextColor={colors.tabBarTextColor}
          tabBarInactiveTextColor={colors.tabBarInactiveTextColor}
          tabBarPosition='top'
          tabBarUnderlineStyle={{
            backgroundColor: colors.tabBarUnderlineColor,
            height: 2,
            borderWidth: 0,
          }}
          tabBarTextStyle={{
            fontFamily: 'System',
            fontSize: 13,
            textAlign: 'center'
          }}>
          <View tabLabel={strings.listTabLabel}>
            <ScrollView
              style={styles.scrollViewContainer}
              refreshControl={
                <RefreshControl
                  tintColor={colors.mainColor}
                  colors={[colors.mainColor]}
                  refreshing={state.fetching}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }>
              <WeatherDisplay
                style={styles.weatherDisplay}
                desiredWeather={state.desiredWeather}
                nearbyCitiesShown={state.nearbyCitiesShown}
                {...cityActions}/>
            </ScrollView>
          </View>
          <WeatherMapView
            tabLabel={strings.mapTabLabel}
            latitude={state.latitude}
            nearbyCitiesShown={state.nearbyCitiesShown}
            longitude={state.longitude}
            {...{mapPoints: createFeaturePoints(state.nearbyCitiesShown)}}
            {...cityActions}/>
        </ScrollableTabView>
        {noContentView}
        {activityIndicatorView}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topContainer: {
    backgroundColor: colors.mainColor,
  },
  centerContainer: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
    borderWidth: 0,
  },
  scrollViewContainer: {
    height: '100%'
  },
  weatherDisplay: {
    backgroundColor: colors.backgroundColor,
  },
  activityIndicatorContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = state => {
  const {
    city,
    latitude,
    longitude,
    range,
    desiredWeather,
    nearbyCities,
    nearbyCitiesShown,
    fetching
  } = state.cityReducer;
  const navigation = state.navigationReducer;
  return {
    state: {
      city: city,
      latitude: latitude,
      longitude: longitude,
      range: range,
      desiredWeather: desiredWeather,
      nearbyCities: nearbyCities,
      nearbyCitiesShown: nearbyCitiesShown,
      fetching: fetching,
      navigation: navigation
    }
  }
};

const mapDispatchToProps = dispatch => {
  return {
    cityActions: bindActionCreators(cityActionCreators, dispatch),
    navigationActions: bindActionCreators(navigationActionCreators, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeatherFinder);
