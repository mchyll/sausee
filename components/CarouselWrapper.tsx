import React from 'react';
import { Component } from "react";
import { Button, ScrollView, View } from "react-native";
import SwipeCounter from "./SwipeCounter";


class CarouselWrapper extends Component<CounterList, CounterList> {

  constructor(props: CounterList) {
    super(props);
    this.state = Object.assign({}, props);
  }

  onChange = (name: string, change: number) => {
    let newState = Object.assign({}, this.state);
    newState.counters.forEach(counter => {
      if (counter.name === name) counter.count += change;
    })
    this.setState(newState)
  }

  render() {
    return (
      <>
        <View style={{borderWidth: 1, position:'absolute', top:80, left: 20, alignSelf:'flex-start', zIndex:10}} >
          <Button title="Go back" onPress={() => }/>
        </View>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
        >
          {this.state.counters.map(value => <SwipeCounter key={value.name} name={value.name} count={value.count} onChange={this.onChange} />)}
        </ScrollView>
      </>
    );
  }
}

export default CarouselWrapper;