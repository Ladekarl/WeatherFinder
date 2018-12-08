'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import colors from '../../shared/styles/colors';
import {
  VictoryLine,
  VictoryLabel,
  VictoryAxis
} from 'victory-native';
import {convertKelvinToCelsius} from '../../shared/weatherHelper';
import NoContentView from '../noContentView';
import Svg, {
  G,
  Line
} from 'react-native-svg';
import strings from '../../shared/i18n/strings';


export default class WeatherGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {layout: undefined}
  }

  unixTimeConverter(unixTime) {
    return new Date(unixTime * 1000);
  }

  getTimeOfDay(date) {
    return `${date.getHours()}`;
  }

  getTodaysForecast(weatherArray) {
    let todaysForecast = [];
    weatherArray.forEach(weather => {
      weather.date = this.unixTimeConverter(weather.dt);
      todaysForecast.push(weather);
    });
    return todaysForecast;
  }

  getTemperatureDataSet(weatherArray) {
    let dataSet = [];
    weatherArray.forEach(weather => {
      dataSet.push({
        x: weather.date,
        y: convertKelvinToCelsius(weather.main.temp)
      });
    });
    return dataSet;
  }

  getPrecipitationDataSet(weatherArray) {
    let dataSet = [];
    weatherArray.forEach(weather => {
      let rain = weather.rain && weather.rain['3h'] ? weather.rain['3h'] : 0;
      let snow = weather.snow && weather.snow['3h'] ? weather.snow['3h'] : 0;
      let precipitation = Math.round(rain + snow);
      dataSet.push({
        x: weather.date,
        y: precipitation,
        width: 5
      });
    });
    return dataSet;
  }

  getDateTickValues(weatherArray) {
    return weatherArray.map(weather => weather.date);
  }

  getTicksBetween(start, end, fn) {
    let tickValues = [];
    for (let i = start; i <= end; i++) {
      let val = fn(i);
      tickValues.push(val);
    }
    return tickValues;
  }

  dateAxisStyle = {
    grid: {
      stroke: (tick) => tick.getHours() === 2 ? colors.mainColor : colors.graphLine,
      strokeWidth: (tick) => tick.getHours() === 2 ? 1 : StyleSheet.hairlineWidth
    },
    axis: {
      stroke: colors.graphLine,
      strokeWidth: StyleSheet.hairlineWidth
    },
    ticks: {
      size: (tick) => tick.getHours() === 2 ? 15 : 0,
      stroke: (tick) => tick.getHours() === 2 ? colors.mainColor : colors.graphLine,
      strokeWidth: (tick) => tick.getHours() === 2 ? 1 : StyleSheet.hairlineWidth
    },
    tickLabels: {
      fill: (tick) => tick.getHours() === 2 ? colors.mainColor : colors.graphLine,
      fontSize: (tick) => tick.getHours() === 2 ? 11 : 10,
      fontWeight: (tick) => tick.getHours() === 2 ? 'bold' : 'normal'
    }
  };

  tempAxisStyle = {
    grid: {
      stroke: colors.graphLine,
      strokeWidth: StyleSheet.hairlineWidth
    },
    axis: {
      stroke: colors.graphLine,
      strokeWidth: StyleSheet.hairlineWidth
    },
    ticks: {
      strokeWidth: StyleSheet.hairlineWidth
    },
    tickLabels: {
      fontSize: 10
    }
  };

  tempLineStyle = {
    data: {
      stroke: colors.sunYellow,
      strokeWidth: 3
    },
    labels: {
      fontSize: 10
    }
  };

  precAxisStyle = {
    grid: {
      stroke: colors.graphLine,
      strokeWidth: StyleSheet.hairlineWidth
    },
    axis: {
      stroke: colors.graphLine,
      strokeWidth: StyleSheet.hairlineWidth
    },
    ticks: {
      strokeWidth: StyleSheet.hairlineWidth
    },
    tickLabels: {
      fontSize: 10
    }
  };

  precLineStyle = {
    data: {
      stroke: colors.rainBlue,
      strokeWidth: 2,
      fill: colors.rainBlue,
      fillOpacity: 0.2,
    },
    labels: {
      fontSize: 10
    }
  };

  axisLabelStyle = {
    fontSize: 10,
    fontWeight: 'bold'
  };

  onLayout(event) {
    if (this.state.layout) return;
    const {height, width} = event.nativeEvent.layout;
    this.setState({
      layout: {
        height: height,
        width: width
      }
    });
  }

  renderForecast(tempDataSet, precDataSet, tickValues) {
    const minTemp = Math.min(...tempDataSet.map((data) => data.y));
    const maxTemp = Math.max(...tempDataSet.map((data) => data.y));
    const minPrec = Math.min(...precDataSet.map((data) => data.y));
    const maxPrec = Math.max(...precDataSet.map((data) => data.y));
    const viewWidth = 2000;
    return (
      <ScrollView
        horizontal={true}
        key='Forecast'>
        <Svg
          height={this.state.layout.height}
          width={viewWidth}
          viewBox={`0 0 ${viewWidth} ${this.state.layout.height }`}>
          <VictoryLabel
            x={30} y={30}
            text={'\u2103'}
            style={this.axisLabelStyle}
          />
          <Line
            x1='25'
            y1='45'
            x2='50'
            y2='45'
            stroke={colors.sunYellow}
            strokeWidth='3'/>
          <VictoryLabel
            x={60} y={30}
            text={'MM'}
            style={this.axisLabelStyle}
          />
          <Line
            x1='55'
            y1='45'
            x2='80'
            y2='45'
            stroke={colors.rainBlue}
            strokeWidth='3'/>
          <VictoryLabel
            x={1955} y={30}
            text={'MM'}
            style={this.axisLabelStyle}
          />
          <Line
            x1='1950'
            y1='45'
            x2='1975'
            y2='45'
            stroke={colors.rainBlue}
            strokeWidth='3'/>
          <G>
            <VictoryAxis
              width={viewWidth}
              scale='time'
              standalone={false}
              domainPadding={5}
              tickValues={tickValues}
              style={this.dateAxisStyle}
              tickFormat={(x) => {
                let tick = this.getTimeOfDay(x);
                if ((x.getHours() === 2)) {
                  tick = ` ${x.toLocaleDateString(strings.getLanguage(), {weekday: 'short', month: 'long', day: 'numeric'}).toUpperCase()}`;
                }
                return tick;
              }}
            />
            <VictoryAxis
              width={viewWidth}
              dependentAxis
              tickValues={this.getTicksBetween(minTemp, maxTemp, (i) => Math.round(i))}
              tickFormat={(y) => {
                return Number(y);
              }}
              domain={[minTemp, maxTemp]}
              domainPadding={20}
              orientation='left'
              standalone={false}
              style={this.tempAxisStyle}
            />
            <VictoryLine
              fixLabelOverlap={true}
              width={viewWidth}
              data={tempDataSet}
              domainPadding={{x: 5, y: 20}}
              domain={{
                x: [tempDataSet[0].x, tempDataSet[tempDataSet.length - 1].x],
                y: [minTemp, maxTemp]
              }}
              labels={(datum) => datum.y}
              labelComponent={<VictoryLabel dy={-10}/>}
              interpolation='monotoneX'
              scale={{x: 'time', y: 'linear'}}
              standalone={false}
              style={this.tempLineStyle}
            />
            <VictoryAxis
              width={viewWidth}
              dependentAxis
              domain={[minPrec, maxPrec < 1 ? 1 : maxPrec * 2]}
              tickValues={this.getTicksBetween(minPrec, maxPrec < 1 ? 1 : maxPrec * 2, (i) => Math.round(i))}
              tickFormat={(y) => {
                return Number(y);
              }}
              orientation='right'
              standalone={false}
              style={this.precAxisStyle}
            />
            <VictoryLine
              fixLabelOverlap={true}
              width={viewWidth}
              domainPadding={{x: 5, y: 0}}
              scale={{x: 'time', y: 'linear'}}
              domain={{
                x: [precDataSet[0].x, precDataSet[precDataSet.length - 1].x],
                y: [minPrec, maxPrec < 1 ? 1 : maxPrec * 2]
              }}
              labels={(datum) => datum.y > 0 ? datum.y : ''}
              labelComponent={<VictoryLabel dy={-10}/>}
              interpolation='step'
              standalone={false}
              data={precDataSet}
              style={this.precLineStyle}
            />
          </G>
        </Svg>
      </ScrollView>);
  }

  renderNoContent() {
    return (<NoContentView key='noContent'/>);
  }

  renderActivityIndicatorView() {
    return (
      <View key='ActivityIndicator' style={styles.activityIndicatorContainer}>
        <ActivityIndicator
          animating={true}
          color={colors.mainColor}
          size='large'
        />
      </View>);
  }

  render() {
    const {forecast, fetching} = this.props;
    let forecastView = [];
    let activityIndicatorView = [];
    if (this.state.layout) {
      let todaysForecast = [];
      let tempDataSet = [];
      let precDataSet = [];

      if (forecast.list) {
        todaysForecast = this.getTodaysForecast(forecast.list.slice());
        if (todaysForecast.length > 0) {
          tempDataSet = this.getTemperatureDataSet(todaysForecast);
          precDataSet = this.getPrecipitationDataSet(todaysForecast);
          if (tempDataSet.length > 0 && precDataSet.length > 0) {
            forecastView.push(this.renderForecast(tempDataSet, precDataSet, this.getDateTickValues(todaysForecast)));
          }
        }
      }

      if (!fetching && forecastView.length < 1) {
        forecastView.push(this.renderNoContent());
      }
    }

    if (fetching || forecastView.length < 1) {
      activityIndicatorView.push(this.renderActivityIndicatorView());
    }

    return (
      <View style={styles.container} onLayout={(event) => this.onLayout(event)}>
        {this.state.layout ? forecastView : undefined}
        {activityIndicatorView}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
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
