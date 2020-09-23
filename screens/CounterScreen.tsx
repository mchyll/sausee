import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import CarouselWrapper from "../components/CarouselWrapper";

type Props = StackScreenProps<RootStackParamList, "CounterScreen">


function CounterScreen({ navigation, route }: Props) {

  let onSave = (currentState: CounterList) => {
    navigation.navigate("FormScreen", currentState);
  }

  return (
    <CarouselWrapper counters={route.params.counters}  />
  )
}

export default CounterScreen;