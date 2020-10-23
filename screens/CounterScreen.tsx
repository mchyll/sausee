import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import CarouselWrapper from "../components/CarouselWrapper";
import { CounterName, RootStackParamList } from '../shared/TypeDefinitions';

type Props = StackScreenProps<RootStackParamList, "CounterScreen">


function CounterScreen({ navigation, route }: Props) {

  let onGoBack = () => {
    console.log("trying to go back");
    navigation.pop();
  }
  const allFields: CounterName[] = ["sheepCountTotal", "whiteGreySheepCount", "blackSheepCount", "brownSheepCount", "blueTieCount", "greenTieCount", "yellowTieCount", "redTieCount", "missingTieCount"]


  return (
    <CarouselWrapper onGoBack={onGoBack} initCounterIndex={route.params.initCounterIndex} counterNames={allFields} />
  )
}

export default CounterScreen;