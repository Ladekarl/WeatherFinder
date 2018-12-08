'use strict';

import React, {Component} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
    Image,
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {getWeatherStringFromId} from '../../shared/weatherHelper';
import Config from 'react-native-config';
import RangeSlider from './rangeSlider';
import WeatherPicker from './weatherPicker';
import strings from '../../shared/i18n/strings';
import colors from '../../shared/styles/colors';

export default class CityInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shouldDisplayListView: false
        }
    }

    styles = {
        container: {
            flex: 0,
            justifyContent: 'flex-start',
            width: '100%',
        },
        textInputContainer: {
            flex: 0,
            minHeight: 50,
            backgroundColor: colors.cityInputBackgroundColor,
            margin: 7,
            borderRadius: 2,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            elevation: 1,
            height: 50,
        },
        textInput: {
            color: colors.topBarTextColor,
            fontSize: 16,
            marginTop: 0,
            alignSelf: 'center',
            backgroundColor: colors.cityInputBackgroundColor,
            height: 40
        },
        description: {
            paddingLeft: 60,
            fontSize: 16,
            alignSelf: 'center',
            color: colors.cityDropdownTextColor
        },
        listView: {
            backgroundColor: colors.mainColor,
            width: '100%',
            borderRadius: 0,
        },
        row: {
            backgroundColor: colors.mainColor,
            flex: 0,
            height: 50,
            width: '100%',
        },
        separator: {
            display: 'none'
        }
    };

    state = {
        showRange: false,
        showWeather: false
    };

    setRangeModalVisible(visible) {
        this.setState({showRange: visible});
    }

    setWeatherModalVisible(visible) {
        this.setState({showWeather: visible});
    }

    getCityName(googleDetails) {
        if (googleDetails.address_components) {
            return googleDetails.address_components[0].short_name;
        }
        return googleDetails.structured_formatting.main_text;
    }

    getLatitude(googleDetails) {
        return googleDetails.geometry.location.lat;
    }

    getLongitude(googleDetails) {
        return googleDetails.geometry.location.lng;
    }

    renderRow = (rowData, rowID, highlighted) => {
        return (
            <TouchableOpacity>
                <Text style={styles.dropdownTextStyle}>
                    {rowData}
                </Text>
            </TouchableOpacity>
        );
    };

    render() {
        const {city, range, desiredWeather, latitude, longitude, nearbyCities, selectCity, changeRange, changeDesiredWeather, fetchNearbyCitiesWeather} = this.props;

        this.closeRangeModal = (changed, changedRange) => {
            if (changed) {
                this.performSearch(changedRange);
            }
            this.setState({showRange: false});
        };

        this.closeWeatherModal = () => {
            this.setState({showWeather: false});
        };

        this.performSearch = (changedRange) => {
            if (city !== '' && latitude !== 0.0 && longitude !== 0.0 && changedRange)
                fetchNearbyCitiesWeather(city, latitude, longitude, changedRange, desiredWeather);
        };

        return (
            <View>
                <GooglePlacesAutocomplete
                    styles={this.styles}
                    placeholder={strings.searchByCity}
                    placeholderTextColor={colors.cityInputPlaceholderColor}
                    onPress={(googleCity, details) =>
                        selectCity(this.getCityName(googleCity), this.getLatitude(details), this.getLongitude(details), range, desiredWeather)}
                    getDefaultValue={() => {
                        return (city ? city : '');
                    }}
                    minLength={2}
                    returnKeyType={'done'}
                    currentLocation={false}
                    listViewDisplayed={this.state.shouldDisplayListView}
                    fetchDetails={true}
                    textInputProps={{
                        disableFullscreenUI: true,
                        onFocus: () => this.setState({shouldDisplayListView: true}),
                        onBlur: () => this.setState({shouldDisplayListView: false})
                    }}
                    isRowScrollable={true}
                    nearbyPlacesAPI='GoogleReverseGeocoding'
                    renderLeftButton={() => <Image style={styles.searchImage}
                                                   source={require('../../img/search-icon.png')}/>}
                    autoFocus={false}
                    enablePoweredByContainer={false}
                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                    query={{
                        key: Config.GOOGLE_API_KEY,
                        language: strings.getLanguage(),
                        types: '(cities)'
                    }}
                    renderRightButton={() =>
                        <ModalDropdown
                            style={styles.settingsButton}
                            options={[`${strings.distance}: ${range} km`, `${strings.weather}: ${getWeatherStringFromId(desiredWeather)}`]}
                            renderRow={this.renderRow}
                            dropdownStyle={styles.dropdownStyle}
                            animated={true}
                            onSelect={(index, value) => {
                                this.onOptionSelected(index);
                            }}
                            renderSeparator={() => {
                            }}>
                            <Image style={styles.settingsImage} source={require('../../img/settings.png')}/>
                        </ModalDropdown>}/>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    onRequestClose={() => {
                    }}
                    visible={this.state.showRange}>
                    <View style={styles.modal}>
                        <RangeSlider
                            range={range}
                            changeRange={changeRange}
                            closeModal={(changed, changedRange) => this.closeRangeModal(changed, changedRange)}/>
                    </View>
                </Modal>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    onRequestClose={() => {
                    }}
                    visible={this.state.showWeather}>
                    <View style={styles.modal}>
                        <WeatherPicker
                            desiredWeather={desiredWeather}
                            nearbyCities={nearbyCities}
                            changeDesiredWeather={changeDesiredWeather}
                            closeModal={() => this.closeWeatherModal()}/>
                    </View>
                </Modal>
            </View>
        );
    }

    onOptionSelected(index) {
        switch (index) {
            case '0':
                this.setRangeModalVisible(true);
                break;
            case '1':
                this.setWeatherModalVisible(true);
                break;
            default:
                break;
        }
    }
}

const styles = StyleSheet.create({
    searchImage: {
        marginLeft: 20,
        width: 25,
        height: 25,
        alignSelf: 'center',
        tintColor: colors.topBarTextColor,
    },
    settingsButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 20,
        elevation: 4
    },
    settingsImage: {
        width: 25,
        height: 25,
        tintColor: colors.topBarTextColor,
        alignItems: 'center',
        alignSelf: 'center',
    },
    dropdownStyle: {
        padding: 10,
        maxHeight: 103,
        backgroundColor: 'white'
    },
    dropdownTextStyle: {
        marginBottom: 10,
        marginTop: 10,
        fontSize: 15,
        fontFamily: 'System',
        color: colors.topBarTextColor
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 5,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.modalBackgroundColor,
    }
});
