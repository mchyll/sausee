import React from 'react';
import { Component } from "react";
import { ScrollView } from "react-native";
import SwipeCounter from "./SwipeCounter";

class CarouselWrapper extends Component {
  state = {  }
  render() {
    return (
      <ScrollView
        horizontal = {true}
        pagingEnabled = {true}
      >
        <SwipeCounter onAdd={() => {}} onSubtract={() => {}}/>
        <SwipeCounter onAdd={() => {}} onSubtract={() => {}}/>
        <SwipeCounter onAdd={() => {}} onSubtract={() => {}}/>
      </ScrollView>
    );
  }
}

export default CarouselWrapper;