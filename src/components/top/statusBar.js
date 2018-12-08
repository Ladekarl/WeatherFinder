'use strict'

import React, {Component} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Platform
} from 'react-native';
import colors from '../../shared/styles/colors';

export default class StatusBarView extends Component {

  render() {
    StatusBar.setBarStyle(colors.statusBarStyle, true);
    if(Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.statusBarColor);
    }

    return (
      <View style={styles.statusBarBackground}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 20 : 0,
    backgroundColor: colors.mainColor,
  }
})
