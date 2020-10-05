import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import FieldGroup from "../components/FieldGroup";
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect } from "react-redux";

type FormScreenProps = StackScreenProps<RootStackParamList, "FormScreen">


function FormScreen({ navigation, route }: FormScreenProps) { // todo: not hardcode counternames

  const totalCount:CounterName[]  = ["sheepCountTotal"];
  const lambOrEwe:CounterName[] = ["lambCount", "eweCount"];
  const colors:CounterName[] = ["whiteSheepCount", "graySheepCount", "brownSheepCount", "blackSheepCount", "blackHeadSheepCount"];
  const ties:CounterName[] = ["blueTieCount", "greenTieCount", "yellowTieCount", "redTieCount", "missingTieCount"];

  let nav = (initCounterIndex: number, counterNames: CounterName[]) => { // maybe no parameters and send it in as other props because it is needed there anyway
    navigation.navigate("CounterScreen", {initCounterIndex, counterNames});
  }

  // todo: this is a wierd pattern as same counternames object has to be passed twice. Look at comment for nav fuction.
  return (
    <>
      <FieldGroup title="Totalt" fields={totalCount} onPressed={() => nav(0, totalCount)}/>
      <FieldGroup title="Farge" fields={colors} onPressed={() => nav(0, colors)}/>
      <FieldGroup title="Slips" fields={ties} onPressed={() => nav(0, ties)}/>
    </>
  )
}

const mapStateToProps = (state: SauseeState, ownProps:FormScreenProps) => {
  let trip = state.trips.find(trip => trip.id === state.currentTrip);
  if(trip === undefined) throw new Error;

  let observation = trip.observations.find(obs => obs.id == state.currentObservation);

  if(observation === undefined) throw new Error;


  return {
    ...ownProps,
    observation: observation
  }
}

export default connect(mapStateToProps)(FormScreen);