import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
  Image
} from 'react-native';
import MapView from 'react-native-maps';
import {getWeatherIconImages} from '../../shared/weatherHelper';
import colors from '../../shared/styles/colors';

const offset_map_small = 0.0001;

export default class WeatherMapViewMarker extends Component {

  onPressMarker() {
    if (this.props.feature.properties.cluster) {
      const {region} = this.props;
      const angle = region.longitudeDelta || 0.0421 / 1.2;
      const result = Math.round(Math.log(360 / angle) / Math.LN2);
      const markers = this.props.clusters['places'].getChildren(this.props.feature.properties.cluster_id, result);
      const newRegion = [];
      const smallZoom = 0.05;

      markers.map(function (element) {
        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1] - region.latitudeDelta * smallZoom,
          longitude: offset_map_small + element.geometry.coordinates[0] - region.longitudeDelta * smallZoom,
        });

        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1],
          longitude: offset_map_small + element.geometry.coordinates[0],
        });

        newRegion.push({
          latitude: offset_map_small + element.geometry.coordinates[1] + region.latitudeDelta * smallZoom,
          longitude: offset_map_small + element.geometry.coordinates[0] + region.longitudeDelta * smallZoom,
        });
      });
      const options = {
        isCluster: true,
        region: newRegion,
      };
      if (this.props.onPress) {
        this.props.onPress({
          feature: this.props.feature,
          options,
        });
      }
    }
  }

  onPressCallout() {
    if (this.props.onPress) {
      this.props.onPress({
        feature: this.props.feature
      });
    }
  }

  renderWeatherMarkerCallout(text) {
    return (
      <MapView.Callout
        key='callout'
        style={styles.callout}>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutText}>{text}</Text>
          <Image
            style={styles.calloutImage}
            source={require('../../img/arrow.png')}/>
        </View>
      </MapView.Callout>)
  }

  calculateBestFittingIcon(cluster) {
    const points = cluster.points;
    let frequency = {};
    let max = 0;
    let result = '01d';
    points.forEach(point => {
      const icon = point.properties.weathericon;
      frequency[icon] = (frequency[icon] || 0) + 1;
      if (frequency[icon] > max) {
        max = frequency[icon];
        result = icon;
      }
    });
    return result;
  }

  renderClusterContent(text) {
    return (
      <Text key='cluster' style={styles.clusterText}>{text}</Text>
    )
  }


  render() {
    const {feature, clusters} = this.props;

    let callout = [];
    let icon = '';
    let anchor = {x: 0.5, y: 0.5};
    let calloutAnchor = {x: 0, y: 0};
    let centerOffset = {x: 0, y: 0};
    let calloutOffset = {x: 0, y: 0};

    if (feature.properties.cluster) {
      icon = this.calculateBestFittingIcon(clusters['places']);
    } else {
      const cityName = feature.properties.cityname;
      const weatherDescription = feature.properties.weatherdescription;
      const text = `${cityName} (${weatherDescription.toLowerCase()})`;
      const anchorX = (text.length + 6) / (text.length * 5);
      const anchorY = (text.length + 6) / (text.length * 4);
      const offsetX = (text.length * 2);
      const offsetY = 15;
      anchor = {x: anchorX, y: anchorY};
      calloutAnchor = {x: anchorX, y: anchorY - 0.25};
      centerOffset = {x: offsetX, y: offsetY};
      calloutOffset = {x: offsetX - (text.length * 4), y: offsetY - 8};
      icon = feature.properties.weathericon;
      callout.push(this.renderWeatherMarkerCallout(text));
    }

    const latitude = feature.geometry.coordinates[1];
    const longitude = feature.geometry.coordinates[0];

    const weatherImages = getWeatherIconImages();

    return (
      <MapView.Marker
        anchor={anchor}
        calloutAnchor={calloutAnchor}
        centerOffset={centerOffset}
        calloutOffset={calloutOffset}
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        onPress={this.onPressMarker.bind(this)}
        onCalloutPress={this.onPressCallout.bind(this)}>
        <Image
          source={weatherImages.get(icon)}
          style={styles.markerImage}/>
        {callout}
      </MapView.Marker>
    );
  }
}

const styles = StyleSheet.create({
  markerImage: {
    alignContent: 'center',
    justifyContent: 'center',
    height: 52.5,
    width: 75,
    opacity: 0.8
  },
  callout: {
    flex: 1,
    position: 'relative',
  },
  calloutContainer: {
    justifyContent: 'space-between',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  calloutText: {
    fontSize: 13,
    color: colors.mainColor,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center'
  },
  calloutImage: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 5,
    height: 8,
    width: 8,
    tintColor: colors.weatherMarkerArrowColor
  }
});
