'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  Slider,
  StyleSheet,
  Image
} from 'react-native'
import Button from 'react-native-button';
import strings from '../../shared/i18n/strings';
import colors from '../../shared/styles/colors';

export default class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: props.range
    }
  }

  render() {
    const {range, changeRange, closeModal} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.rangeText}>{strings.distance}</Text>
          <Text style={styles.rangeValue}>{this.state.sliderValue} km</Text>
        </View>
        <View style={styles.sliderContainer}>
          <Image style={styles.carImage} source={require('../../img/car-icon.png')}/>
          <Slider style={styles.rangeSlider}
                  maximumValue={300}
                  minimumValue={10}
                  value={range}
                  onValueChange={(sliderValue) => this.setState({sliderValue})}
                  step={10}
                  thumbTintColor={colors.mainColor}
                  maximumTrackTintColor={colors.mainColor}/>
        </View>
        <Text style={styles.rangeDescription}>{strings.distanceWillingToTravel}</Text>
        <View style={styles.buttonContainer}>
          <Button
            containerStyle={styles.buttonContainerStyle}
            onPress={() => {
              closeModal(false);
            }}>
            <Text style={styles.buttonStyle}>{strings.cancel}</Text>
          </Button>
          <Button
            containerStyle={styles.buttonContainerStyle}
            onPress={() => {
              changeRange(this.state.sliderValue);
              closeModal(true, this.state.sliderValue);
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
    opacity: 1,
    height: 200,
    alignSelf: 'center',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rangeSlider: {
    alignSelf: 'center',
    width: '85%',
  },
  rangeText: {
    fontSize: 16
  },
  rangeDescription: {
    fontSize: 13,
    marginBottom: 5,
    color: colors.modalDescriptionTextColor
  },
  rangeValue: {
    backgroundColor: colors.mainColor,
    borderRadius: 2,
    color: colors.modalColor,
    padding: 4,
    fontSize: 16
  },
  carImage: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 15,
    width: 30,
    marginLeft: 10,
    marginTop: 15,
    marginBottom: 15
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
  }
});
