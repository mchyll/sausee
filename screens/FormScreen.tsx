import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import FieldGroup from "../components/FieldGroup";
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from "react-redux";
import { Button, ScrollView } from 'react-native';
import TotalFieldGroup from '../components/TotalFieldGroup';
import { finishObservation } from "../shared/ActionCreators";


const mapStateToProps = (state: SauseeState) => ({
  observation: state.trips.find(t => t.id === state.currentTripId)?.observations.find(o => o.id === state.currentObservationId)
})

const connector = connect(mapStateToProps, { finishObservation });

type FormScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "FormScreen"> // after & is external props

function FormScreen(props: FormScreenProps) { // todo: not hardcode counternames
  // Prevent null reference error when leaving form screen after current observation is finished
  if (!props.observation) {
    // TODO: Instead of setting the whole form screen blank, do this check in the form field component and set each of them blank to prevent the view from changing so drastically
    return <></>
  }

  const colors:CounterName[] = ["whiteSheepCount", "graySheepCount", "brownSheepCount", "blackSheepCount", "blackHeadSheepCount"];
  const ties:CounterName[] = ["blueTieCount", "greenTieCount", "yellowTieCount", "redTieCount", "missingTieCount"];

  let nav = (initCounterIndex: number, counterNames: CounterName[]) => { // maybe send it in as other props because it is needed there anyway
    props.navigation.navigate("CounterScreen", { initCounterIndex, counterNames });
  }

  return (
    <ScrollView>
      <TotalFieldGroup onPressed={nav}></TotalFieldGroup>
      <FieldGroup title="Farge" fields={colors} onPressed={nav}/>
      <FieldGroup title="Slips" fields={ties} onPressed={nav}/>
    
      <Button title="Finish" onPress={() => {
        // If map-first navigation flow was taken, the observation is now completed
        if (props.observation?.yourCoordinates && props.observation.sheepCoordinates) {
          props.finishObservation();
        }
        props.navigation.navigate("MapScreen");
      }} />
    </ScrollView>
  )
}

export default connector(FormScreen);
