import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import FieldGroup from "../components/FieldGroup";
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from "react-redux";
import { Button } from 'react-native';
import { finishObservation } from "../shared/ActionCreators";


const mapStateToProps = (state: SauseeState) => {
  const trip = state.trips.find(trip => trip.id === state.currentTripId);
  if (trip === undefined) throw new Error("Tried to mount component when currentTrip was undefined");

  const observation = trip?.observations.find(obs => obs.id == state.currentObservationId);
  if (observation === undefined) throw new Error("Tried to mount component when currentObservation was undefined");

  return { observation }
}

const connector = connect(mapStateToProps, { finishObservation });

type FormScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "FormScreen">

function FormScreen(props: FormScreenProps) { // todo: not hardcode counternames

  let counterNames1: CounterName[] = ["sheepCountTotal"];
  let counterNames2: CounterName[] = ["whiteSheepCount", "graySheepCount", "brownSheepCount", "blackSheepCount"]

  // todo: pass inn counternames so that fieldgroup is populated dynamicly
  // update values in counters with dispatching actions.
  // see if dispatching only is enough to update ui live
  // go back to form to see if values is updated
  let nav = (initCounterIndex: number, counterNames: CounterName[]) => { // maybe no parameters and send it in as other props because it is needed there anyway
    props.navigation.navigate("CounterScreen", { initCounterIndex, counterNames });
  }

  // todo: this is a wierd pattern as same counternames object has to be passed twice
  return (
    <>
      <FieldGroup title="first title" fields={counterNames1} onPressed={() => nav(0, counterNames1)} />
      <FieldGroup title="second title" fields={counterNames2} onPressed={() => nav(0, counterNames2)} />
      <Button title="Finish" onPress={() => {
        // If map-first navigation flow was taken, the observation is now completed
        if (props.observation.yourCoordinates && props.observation.sheepCoordinates) {
          props.finishObservation();
        }
        props.navigation.navigate("MapScreen");
      }} />
    </>
  )
}

export default connector(FormScreen);
