'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    ScrollView
} from 'react-native';
import {
    convertKelvinToCelsius,
    getWeatherBannerImages,
    getWeatherDescription,
    getWeatherIconImages
} from '../shared/weatherHelper';
import colors from '../shared/styles/colors';
import WeatherGraph from '../components/forecast/weatherGraph';
import strings from '../shared/i18n/strings';

class WeatherForecast extends Component {

    static navigationOptions = ({navigation}) => ({
        title: `${navigation.state.params.city.name}`,
        headerStyle: {
            backgroundColor: colors.mainColor
        },
        headerTitleStyle: {
            fontSize: 20,
            paddingLeft: 10
        },
        headerTintColor: colors.headerTextColor
    });

    constructor(props) {
        super(props);
    }

    _getDescription(weather) {
        let description = getWeatherDescription(weather.weather[0].id);
        return (description ? description : weather.weather[0].description);
    }


    render() {
        const {forecast, fetching, navigation} = this.props;
        const {city, weather} = navigation.state.params;

        const weatherBannerImages = getWeatherBannerImages();
        const weatherIconImages = getWeatherIconImages();
        const updateDate = new Date(weather.dt * 1000);
        return (
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
                        <Text style={styles.temperatureText}>{convertKelvinToCelsius(weather.main.temp)} &#8451;</Text>
                    </View>
                    <View style={styles.weatherDetailsContainer}>
                        <View style={styles.weatherDetailContainer}>
                            <Image
                                style={styles.weatherDetailsImage}
                                source={require('../img/wind.png')}/>
                            <Text style={styles.weatherDetailsText}>{Math.round(weather.wind.speed)} m/s</Text>
                        </View>
                        <View style={styles.weatherDetailContainer}>
                            <Image
                                style={styles.weatherDetailsImage}
                                source={require('../img/humidity.png')}/>
                            <Text style={styles.weatherDetailsText}>{Math.round(weather.main.humidity)} %</Text>
                        </View>
                        <View style={styles.weatherDetailContainer}>
                            <Image
                                style={styles.weatherDetailsImage}
                                source={require('../img/pressure.png')}/>
                            <Text style={styles.weatherDetailsText}>{Math.round(weather.main.pressure)} hPa</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.forecastContainer}>
                    <Text
                        style={styles.updateText}>{`${strings.updated} ${updateDate.getHours()}.${updateDate.getMinutes()}`}</Text>
                    <WeatherGraph
                        forecast={forecast}
                        fetching={fetching}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        height: '100%',
        marginBottom: 7,
        backgroundColor: colors.weatherCardBackgroundColor,
        borderRadius: 2,
        elevation: 1,
    },
    bannerImage: {
        width: '100%',
        borderRadius: 50,
        height: 160
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
        color: 'white',
    },
    contentContainer: {
        opacity: 0.9,
        backgroundColor: colors.mainColor,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    descriptionContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    temperatureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    temperatureText: {
        fontSize: 30,
        color: colors.currentWeatherTextColor
    },
    iconImage: {
        height: 35,
        width: 50,
    },
    descriptionText: {
        color: colors.currentWeatherTextColor,
        fontSize: 15,
        textAlign: 'center'
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
        marginLeft: 10,
        color: colors.currentWeatherTextColor
    },
    weatherDetailsImage: {
        tintColor: colors.currentWeatherTextColor,
        opacity: 0.9,
        height: 10,
        width: 10,
        marginLeft: 5,
    },
    forecastContainer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    updateText: {
        paddingTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    },
    datesScrollview: {}
});

export default connect(state => (
    {
        forecast: state.cityReducer.forecast,
        fetching: state.cityReducer.fetching
    })
)(WeatherForecast);