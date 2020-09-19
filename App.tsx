import React from 'react';
import { StyleSheet, View } from 'react-native';
import CarouselWrapper from './components/CarouselWrapper';
import SwipeCounter from './components/SwipeCounter';

export default class App extends React.Component<{}, {}> {

  render() {
    return (
      <View >
        <CarouselWrapper/>
      </View>
    );
  }
}



