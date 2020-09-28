import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import CarouselWrapper from "../components/CarouselWrapper";
import { CounterNameList, RootStackParamList } from '../shared/TypeDefinitions';

type Props = StackScreenProps<RootStackParamList, "CounterScreen">


function CounterScreen({ navigation, route }: Props) {

  let onSave = (currentState: CounterNameList) => {
    navigation.navigate("FormScreen", currentState);
  }

  return (
    <CarouselWrapper initCounterIndex={0} counterNames={route.params.counterNames}  />
  )
}

export default CounterScreen;