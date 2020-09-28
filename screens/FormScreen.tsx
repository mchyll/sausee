import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import FieldGroup from "../components/FieldGroup";
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect } from "react-redux";

type FormScreenProps = StackScreenProps<RootStackParamList, "FormScreen">


function FormScreen({ navigation, route }: FormScreenProps) { // todo: not hardcode counternames

  let counterNames1:CounterName[]  = ["sheepCountTotal"];
  let counterNames2:CounterName[] = ["whiteSheepCount", "graySheepCount", "brownSheepCount", "blackSheepCount"]

  // todo: pass inn counternames so that fieldgroup is populated dynamicly
  // update values in counters with dispatching actions.
  // see if dispatching only is enough to update ui live
  // go back to form to see if values is updated
  let nav = (initCounterIndex: number, counterNames: CounterName[]) => { // maybe no parameters and send it in as other props because it is needed there anyway
    navigation.navigate("CounterScreen", {initCounterIndex, counterNames});
  }

  return (
    <>
      <FieldGroup onPressed={() => nav(0, counterNames1)}/>
      <FieldGroup onPressed={() => nav(0, counterNames2)}/>
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