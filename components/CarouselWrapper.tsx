import React from 'react';
import { Component } from "react";
import { Button, ScrollView, View } from "react-native";
import SwipeCounter from "./SwipeCounter";
import { CounterNameList, CounterName, Observation, SauseeState, Trip } from "../shared/TypeDefinitions"
import { connect } from "react-redux"
import { changeCounter } from '../shared/ActionCreators';

interface InternalCarouselWrapperProps extends ExternalCarouselWrapperProps {

  observation: Observation,
  changeCounter: (countername: CounterName, change: number) => void,
  onGoBack: () => void,
}

interface ExternalCarouselWrapperProps extends CounterNameList {
  onGoBack: () => void,
}

const CarouselWrapper = (props: InternalCarouselWrapperProps) => {
  return (
    <>
      <View style={{borderWidth: 1, position:'absolute', top:80, left: 20, alignSelf:'flex-start', zIndex:10}} >
        <Button title="Go back" onPress={() => props.onGoBack()}/>
      </View>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
      >
        {props.counterNames.map(name => <SwipeCounter key={name} name={name} count={props.observation[name]} onChange={props.changeCounter} />)}
      </ScrollView>
    </>
  );
}

const mapStateToProps = (state: SauseeState, ownProps: ExternalCarouselWrapperProps) => {
  let trip = state.trips.find(trip => trip.id === state.currentTrip);
  if(trip === undefined) throw new Error;

  let observation = trip.observations.find(obs => obs.id == state.currentObservation);

  if(observation === undefined) throw new Error;


  return {
    ...ownProps,
    observation: observation,
  }
}

const mapDispatchToProps = (dispatch: any) => { // todo: remove any
  return {
    changeCounter: (counterName: CounterName, change: number) => changeCounter(counterName, change),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarouselWrapper);