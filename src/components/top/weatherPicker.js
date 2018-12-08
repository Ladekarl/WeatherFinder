'use strict';

import React, {Component} from 'react';
import {
  Picker,
  View,
  StyleSheet,
  Text,
  Image,
  ActionSheetIOS,
  Platform
} from 'react-native';
import Button from 'react-native-button';
import strings from '../../shared/i18n/strings';
import colors from '../../shared/styles/colors';


var buttons = [strings.all, strings.clear, strings.snow, strings.rain, strings.clouds, strings.cancel];

export default class WeatherPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      desiredWeather: props.desiredWeather
    };
  }

  renderPickerView() {
    return(
      <View key='WeatherPicker' style={styles.weatherPickerContainer}>
        <Picker
          mode='dropdown'
          style={styles.weatherPicker}
          selectedValue={this.state.desiredWeather}
          onValueChange={(itemValue, itemIndex) => this.setState({desiredWeather: itemValue})}>
          <Picker.Item label={strings.all} value='1'/>
          <Picker.Item label={strings.clear} value='800'/>
          <Picker.Item label={strings.snow} value='6'/>
          <Picker.Item label={strings.rain} value='5'/>
          <Picker.Item label={strings.clouds} value='80'/>
        </Picker>
      </View>
    );
  }

  convertValToString(val) {
    let string = '';
    switch(val) {
      case '1':
        string = strings.all;
        break;
      case '800':
        string = strings.clear;
        break;
      case '6':
        string = strings.snow;
        break;
      case '5':
        string = strings.rain;
        break;
      case '80':
        string = strings.clouds;
        break;
    }
    return string;
  }

  showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: 5
    },
    (buttonIndex) => {
      if(buttonIndex === 5) return;
      const buttonPressed = buttons[buttonIndex];
      let value;
      switch(buttonPressed) {
        case strings.all:
          value = '1';
          break;
        case strings.clear:
          value = '800';
          break;
        case strings.snow:
          value = '6';
          break;
        case strings.rain:
          value = '5';
          break;
        case strings.clouds:
          value = '80';
          break;
      }
      this.setState({desiredWeather: value})
    });
  }

  renderTextView() {
    let string = this.convertValToString(this.state.desiredWeather);
    return(
      <Button
        key='actionSheet'
        onPress={this.showActionSheet}
        containerStyle={styles.textPickerContainer}
        style={styles.textPickerButton}>
        <Text style={styles.textPicker}>
          {string}
        </Text>
        <Image
          style={styles.textImage}
          source={require('../../img/arrow-down.png')}/>
      </Button>
    );
  }

  render() {
    const {nearbyCities, changeDesiredWeather, closeModal} = this.props;
    let pickerView = [];
    if(Platform.OS === 'ios') {
      pickerView.push(this.renderTextView());
    } else {
      pickerView.push(this.renderPickerView());
    }
    return (
      <View style={styles.container}>
        <Text style={styles.weatherText}>{strings.weather}</Text>
        {pickerView}
        <Text style={styles.pickerDescription}>{strings.weatherToFind}</Text>
        <View style={styles.buttonContainer}>
          <Button
            containerStyle={styles.buttonContainerStyle}
            onPress={() => {
              closeModal();
            }}>
            <Text style={styles.buttonStyle}>{strings.cancel}</Text>
          </Button>
          <Button
            containerStyle={styles.buttonContainerStyle}
            onPress={() => {
              changeDesiredWeather(this.state.desiredWeather, nearbyCities);
              closeModal();
            }}>
            <Text style={styles.buttonStyle}>{strings.ok}</Text>
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '92%',
    backgroundColor: colors.modalColor,
    borderRadius: 2,
    opacity: 10,
    height: 200,
    alignSelf: 'center',
    padding: 10
  },
  weatherText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20
  },
  weatherPickerContainer: {
    backgroundColor: colors.modalPickerBackgroundColor,
    borderRadius: 2,
    elevation: 0,
    opacity: 0.9
  },
  weatherPicker: {
  },
  pickerDescription: {
    marginTop: 10,
    fontSize: 13,
    color: colors.modalDescriptionTextColor
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 5
  },
  buttonContainerStyle: {
    alignSelf: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 30
  },
  buttonStyle: {
    color: colors.mainColor,
    fontSize: 15
  },
  textPickerContainer: {
    backgroundColor: colors.modalPickerBackgroundColor,
    borderRadius: 2,
    elevation: 0,
    opacity: 0.9
  },
  textPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  textPicker: {
    alignSelf: 'stretch',
    padding: 10,
  },
  textImage: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 20,
    height: 10,
    width: 10,
  }
});
