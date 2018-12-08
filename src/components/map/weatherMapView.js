'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import MapView from 'react-native-maps';
import supercluster from 'supercluster';
import WeatherMapViewMarker from './weatherMapViewMarker';
import {calculateDeltas} from '../../shared/weatherMapHelper';

export default class WeatherMapView extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        mapLock: false,
    };

    cityLat = 0;
    cityLong = 0;
    nearbyCitySize = 0;

    setRegion(region) {
        if (Array.isArray(region)) {
            region.map(function (element) {
                if (element.hasOwnProperty('latitudeDelta') && element.hasOwnProperty('longitudeDelta')) {
                    region = element;
                }
            });
        }
        if (!Array.isArray(region)) {
            this.setState({
                region: region
            });
        }
    }

    componentDidMount() {
        let region = this.calculateCustomRegion(this.props.latitude, this.props.longitude, this.props.nearbyCitiesShown);
        this.setState({region: region});
        this.setNewData(this.props.latitude, this.props.longitude, this.props.nearbyCitiesShown.size);
        this.componentWillReceiveProps(this.props);
    }

    componentDidUpdate() {
        if (!this.mapReady() ||
            this.props.nearbyCitiesShown.size < 1 ||
            !this.newDataReceived(this.props)
        ) return;
        this.setNewData(this.props.latitude, this.props.longitude, this.props.nearbyCitiesShown.size);
        this.goToRegion(this.calculateLatLngs(this.props.nearbyCitiesShown), 100);
    }

    mapReady() {
        return (this.map.state.isReady && !this.state.moving);
    }

    setNewData(lat, long, size) {
        this.cityLat = lat;
        this.cityLong = long;
        this.nearbyCitySize = size;
    }

    newDataReceived(props) {
        return (this.cityLat !== props.latitude ||
            this.cityLong !== props.longitude ||
            this.nearbyCitySize !== props.nearbyCitiesShown.size);
    }

    createMarkersForLocations(props) {
        return {
            places: props.mapPoints
        };
    }

    calculateCustomRegion(latitude, longitude, nearbyCitiesShown) {
        let latLngs = this.calculateLatLngs(nearbyCitiesShown);
        const {deltaX, deltaY} = calculateDeltas({latitude: latitude, longitude: longitude}, latLngs);
        return {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: deltaX,
            longitudeDelta: deltaY
        };
    }

    calculateLatLngs(nearbyCitiesShown) {
        let latLngs = [];
        nearbyCitiesShown.forEach((weather, city) => {
            latLngs.push({latitude: Number(city.lat), longitude: Number(city.lng)});
        });
        return latLngs;
    }


    componentWillReceiveProps(nextProps) {
        const markers = this.createMarkersForLocations(nextProps);
        if (markers && Object.keys(markers)) {
            const clusters = {};
            this.setState({
                mapLock: true
            });
            Object.keys(markers).forEach(categoryKey => {
                // Recalculate cluster trees
                const cluster = supercluster({
                    radius: 60,
                    maxZoom: 16,
                });

                cluster.load(markers[categoryKey]);

                clusters[categoryKey] = cluster;
            });

            this.setState({
                clusters,
                mapLock: false
            });
        }
    }

    getZoomLevel(region = this.state.region) {
        const angle = region.longitudeDelta;
        return Math.round(Math.log(360 / angle) / Math.LN2);
    }

    createMarkersForRegion() {
        const padding = 0.25;
        if (this.state.clusters && this.state.clusters['places']) {
            const markers = this.state.clusters['places'].getClusters([
                this.state.region.longitude - (this.state.region.longitudeDelta * (0.5 + padding)),
                this.state.region.latitude - (this.state.region.latitudeDelta * (0.5 + padding)),
                this.state.region.longitude + (this.state.region.longitudeDelta * (0.5 + padding)),
                this.state.region.latitude + (this.state.region.latitudeDelta * (0.5 + padding)),
            ], this.getZoomLevel());
            const markersToShow = [];
            const {clusters, region} = this.state;
            const onPressMarker = this.onPressMarker.bind(this);
            markers.map(function (element) {
                markersToShow.push(
                    <WeatherMapViewMarker
                        key={element.properties._id || element.properties.cluster_id}
                        onPress={onPressMarker}
                        feature={element}
                        clusters={clusters}
                        region={region}
                    />
                );
            });
            return markersToShow;
        }
        return [];
    }

    onPressMarker(markerOptions) {
        if (markerOptions.feature.properties.cluster) {
            if (markerOptions.options &&
                markerOptions.options.region &&
                markerOptions.options.region.length > 0) {
                this.goToRegion(markerOptions.options.region, 100);
            }
        } else {
            this.markerCalloutPressed(markerOptions);
        }
    }

    markerCalloutPressed(markerOptions) {
        let cityToShow;
        let weatherToShow;
        let nearbyCitiesShown = this.props.nearbyCitiesShown;
        nearbyCitiesShown.forEach((weather, city) => {
            if (city.geonameId === markerOptions.feature.properties._id) {
                cityToShow = city;
                weatherToShow = weather;
            }
        });
        if (cityToShow && weatherToShow) {
            this.props.getWeatherForecast(cityToShow, weatherToShow);
        }
    }

    goToRegion(region, padding) {
        this.map.fitToCoordinates(region, {
            edgePadding: {top: padding, right: padding, bottom: padding, left: padding},
            animated: true,
        });
    }


    onChangeRegionComplete(region) {
        this.setRegion(region);
        this.setState({
            moving: false,
        });
    }


    onChangeRegion(region) {
        this.setState({
            moving: true,
        });
    }

    render() {
        return (
            <View>
                <MapView
                    ref={ref => {
                        this.map = ref;
                    }}
                    initialRegion={this.state.region}
                    style={styles.map}
                    onRegionChange={this.onChangeRegion.bind(this)}
                    onRegionChangeComplete={this.onChangeRegionComplete.bind(this)}>
                    {this.createMarkersForRegion()}
                </MapView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    map: {
        height: '100%',
        width: '100%',
    }
});
