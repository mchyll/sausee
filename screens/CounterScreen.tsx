import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import CarouselWrapper from "../components/CarouselWrapper";
import { CounterNameList, RootStackParamList } from '../shared/TypeDefinitions';

type Props = StackScreenProps<RootStackParamList, "CounterScreen">


function CounterScreen({ navigation, route }: Props) {

  let onGoBack = () => {
    console.log("trying to go back");
    navigation.pop();
  }

  return (
    <CarouselWrapper onGoBack={onGoBack} initCounterIndex={route.params.initCounterIndex} counterNames={route.params.counterNames}  />
  )
}

export default CounterScreen;