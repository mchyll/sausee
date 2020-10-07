import React, { useEffect, useRef } from 'react';
import { Button, Dimensions, ScrollView, View } from "react-native";
import SwipeCounter from "./SwipeCounter";
import { CounterNameList, CounterName, Observation, SauseeState } from "../shared/TypeDefinitions"
import { connect, ConnectedProps } from "react-redux"
import { changeCounter } from '../shared/ActionCreators';
import { mapCurrentObservationToProps } from '../shared/Mappers';


interface ExternalCarouselWrapperProps extends CounterNameList {
  onGoBack: () => void,
}

const connector = connect(mapCurrentObservationToProps, { changeCounter });

type CarouselWrapperProps = ConnectedProps<typeof connector> & ExternalCarouselWrapperProps

const CarouselWrapper = (props: CarouselWrapperProps) => {
  if (!props.observation) {
    return <></>
  }

  const counterRef = useRef<ScrollView>(null);
  useEffect(() => {
    counterRef.current?.scrollTo({ x: Dimensions.get("window").width * props.initCounterIndex, y: 0, animated: false });
  }, []);

  return (
    <>
      <View style={{ borderWidth: 1, position: 'absolute', top: 80, left: 20, alignSelf: 'flex-start', zIndex: 10 }} >
        <Button title="Go back" onPress={() => props.onGoBack()} />
      </View>
      <ScrollView ref={counterRef}
        horizontal={true}
        pagingEnabled={true}
      >
        {props.counterNames.map(name => <SwipeCounter key={name} name={name} count={props.observation?.[name]} onChange={props.changeCounter} />)}
      </ScrollView>
    </>
  );
}

export default connector(CarouselWrapper);
