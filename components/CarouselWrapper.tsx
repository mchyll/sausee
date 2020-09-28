import React from 'react';
import { Component } from "react";
import { Button, ScrollView, View } from "react-native";
import SwipeCounter from "./SwipeCounter";
import { CounterNameList, CounterNames, Observation, SauseeState, Trip } from "../shared/TypeDefinitions"
import { connect } from "react-redux"

interface InternalCarouselWrapperProps extends CounterNameList {

  observation: Observation
}

class CarouselWrapper extends Component<InternalCarouselWrapperProps> {

  constructor(props: InternalCarouselWrapperProps) {
    super(props);
  }

  onChange = (name: CounterNames, change: number) => {
    let prevValue = this.props.observation[name] ?? 0;
    this.props.observation[name] = prevValue + change;
  }

  render() {
    console.log("The props: ", this.props);
    return (
      <>
        <View style={{borderWidth: 1, position:'absolute', top:80, left: 20, alignSelf:'flex-start', zIndex:10}} >
          <Button title="Go back" onPress={() => console.log("logging backgoing")}/>
        </View>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
        >
          {this.props.counterNames.map(name => <SwipeCounter key={name} name={name} count={this.props.observation[name]} onChange={this.onChange} />)}
        </ScrollView>
      </>
    );
  }
}

const mapStateToProps = (state: SauseeState, ownProps: CounterNameList) => {
  let trip = state.trips.find(trip => trip.id === state.currentTrip);
  if(trip === undefined) throw new Error;

  let observation = trip.observations.find(obs => obs.id == state.currentObservation);

  if(observation === undefined) throw new Error;


  return {
    ...ownProps,
    observation: observation
  }
}

export default connect(mapStateToProps)(CarouselWrapper);