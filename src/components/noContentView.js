'use strict';

import React, {Component} from 'react';
import strings from '../shared/i18n/strings'
import colors from '../shared/styles/colors'
import {
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native'

export default class NoContentView extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.noContentContainer}>
        <View style={styles.elevateContainer}>
          <Image style={styles.noContentImage} source={require('../img/search-icon.png')}/>
          <Text style={styles.noContentText}>{strings.noResultsFound}</Text>
        </View>
      </View>);
  }
}

const styles = StyleSheet.create({
  noContentContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  elevateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.noContentBackgroundColor,
    elevation: 2,
    padding: 10,
    opacity: 0.8,
    borderRadius: 5
  },
  noContentImage: {
    height: 80,
    width: 80,
    tintColor: colors.noContentColor
  },
  noContentText: {
    fontSize: 15,
    color: colors.noContentColor
  }
});