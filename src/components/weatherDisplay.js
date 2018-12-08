'use strict';

import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    ImageBackground,
    Image
} from 'react-native';
import {
    convertKelvinToCelsius,
    getWeatherBannerImages,
    getWeatherDescription,
    getWeatherIconImages
} from '../shared/weatherHelper';
import Button from 'react-native-button';
import colors from '../shared/styles/colors';

export default class WeatherDisplay extends Component {

    weathers = [];

    constructor(props) {
        super(props);
    }

    _handlePress(city, weather) {
        this.props.getWeatherForecast(city, weather);
    }

    _getDescription(weather) {
        let description = getWeatherDescription(weather.weather[0].id);
        return (description ? description : weather.weather[0].description);
    }

    render() {
        const {nearbyCitiesShown} = this.props;
        const weatherBannerImages = getWeatherBannerImages();
        const weatherIconImages = getWeatherIconImages();

        this.weathers = [];

        nearbyCitiesShown.forEach((weather, city) => {
            return (
                this.weathers.push(
                    <Button key={city.geonameId}
                            onPress={() => this._handlePress(city, weather)}>
                        <View style={styles.cardContainer}>
                            <ImageBackground
                                style={styles.bannerImage}
                                source={weatherBannerImages.get(weather.weather[0].icon)}
                                borderRadius={2}>
                                <View style={styles.bannerTextContainer}>
                                    <View style={styles.bannerTextBarContainer}>
                                        <Text style={styles.cityText}>{city.name}</Text>
                                        <Text style={styles.cityText}>{Math.round(Number(city.distance))} km</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                            <View style={styles.contentContainer}>
                                <View style={styles.descriptionContainer}>
                                    <Image
                                        style={styles.iconImage}
                                        source={weatherIconImages.get(weather.weather[0].icon)}/>
                                    <Text style={styles.descriptionText}>{this._getDescription(weather)}</Text>
                                </View>
                                <View style={styles.temperatureContainer}>
                                    <Text
                                        style={styles.temperatureText}>{convertKelvinToCelsius(weather.main.temp)} &#8451;</Text>
                                </View>
                                <View style={styles.weatherDetailsContainer}>
                                    <View style={styles.weatherDetailContainer}>
                                        <Image
                                            style={styles.weatherDetailsImage}
                                            source={require('../img/wind.png')}/>
                                        <Text
                                            style={styles.weatherDetailsText}>{Math.round(weather.wind.speed)} m/s</Text>
                                    </View>
                                    <View style={styles.weatherDetailContainer}>
                                        <Image
                                            style={styles.weatherDetailsImage}
                                            source={require('../img/humidity.png')}/>
                                        <Text
                                            style={styles.weatherDetailsText}>{Math.round(weather.main.humidity)} %</Text>
                                    </View>
                                    <View style={styles.weatherDetailContainer}>
                                        <Image
                                            style={styles.weatherDetailsImage}
                                            source={require('../img/pressure.png')}/>
                                        <Text
                                            style={styles.weatherDetailsText}>{Math.round(weather.main.pressure)} hPa</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Button>
                )
            );
        });

        return (
            <View style={styles.container}>
                {this.weathers}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        backgroundColor: colors.weatherListBackgroundColor,
        padding: 3,
    },
    cardContainer: {
        height: 160,
        marginBottom: 7,
        backgroundColor: colors.weatherCardBackgroundColor,
        borderRadius: 2,
        elevation: 1,
    },
    bannerImage: {
        width: '100%',
        borderRadius: 50,
        height: 70
    },
    bannerTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    bannerTextBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 3,
        opacity: 0.7,
        backgroundColor: colors.weatherBannerBackgroundColor,
        paddingLeft: 10,
        paddingRight: 10
    },
    cityText: {
        fontSize: 15,
        color: colors.weatherBannerTextColor,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20
    },
    descriptionContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 1,
    },
    descriptionText: {
        textAlign: 'center'
    },
    temperatureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    temperatureText: {
        fontSize: 20,
    },
    iconImage: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        width: 50,
    },
    weatherDetailsContainer: {
        flex: 1
    },
    weatherDetailContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 2
    },
    weatherDetailsText: {
        fontSize: 12,
        paddingTop: 1,
        marginLeft: 10
    },
    weatherDetailsImage: {
        tintColor: colors.weatherDetailsImageColor,
        opacity: 0.9,
        height: 10,
        width: 10,
        marginLeft: 10
    }
});