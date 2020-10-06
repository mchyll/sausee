import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import FieldGroup from "../components/FieldGroup";
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from "react-redux";
import { Button, ScrollView } from 'react-native';
import { finishForm } from "../shared/ActionCreators";
import TotalFieldGroup from '../components/TotalFieldGroup';


const mapStateToProps = (state: SauseeState) => {
  const trip = state.trips.find(trip => trip.id === state.currentTripId);
  if (trip === undefined) throw new Error("Tried to mount component when currentTrip was undefined");

  const observation = trip?.observations.find(obs => obs.id == state.currentObservationId);
  if (observation === undefined) throw new Error("Tried to mount component when currentObservation was undefined");

  return { observation }
}

const connector = connect(mapStateToProps, { finishForm });

type FormScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "FormScreen"> // after & is external props

function FormScreen(props: FormScreenProps) { // todo: not hardcode counternames

  const colors:CounterName[] = ["whiteSheepCount", "graySheepCount", "brownSheepCount", "blackSheepCount", "blackHeadSheepCount"];
  const ties:CounterName[] = ["blueTieCount", "greenTieCount", "yellowTieCount", "redTieCount", "missingTieCount"];

  let nav = (initCounterIndex: number, counterNames: CounterName[]) => { // maybe send it in as other props because it is needed there anyway
    props.navigation.navigate("CounterScreen", { initCounterIndex, counterNames });
  }

  // todo: this is a wierd pattern as same counternames object has to be passed twice. Look at comment for nav fuction.
  return (
    <ScrollView>
      <TotalFieldGroup onPressed={nav}></TotalFieldGroup>
      <FieldGroup title="Farge" fields={colors} onPressed={nav}/>
      <FieldGroup title="Slips" fields={ties} onPressed={nav}/>
    
      <Button title="Finish" onPress={() => {
        props.finishForm();
        props.navigation.navigate("MapScreen");
      }} />
    </ScrollView>
  )
}

export default connector(FormScreen);
