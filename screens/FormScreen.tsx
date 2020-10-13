import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import FieldGroup from "../components/FieldGroup";
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from "react-redux";
import { Button, ScrollView } from 'react-native';
import TotalFieldGroup from '../components/TotalFieldGroup';
import { finishObservation } from "../shared/ActionCreators";
import { mapCurrentObservationToProps } from '../shared/Mappers';


const connector = connect(mapCurrentObservationToProps, { finishObservation });

type FormScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "FormScreen"> // after & is external props

function FormScreen(props: FormScreenProps) { // todo: not hardcode counternames

  const colors: CounterName[] = ["whiteSheepCount", "graySheepCount", "brownSheepCount", "blackSheepCount", "blackHeadSheepCount"];
  const ties: CounterName[] = ["blueTieCount", "greenTieCount", "yellowTieCount", "redTieCount", "missingTieCount"];

  let nav = (initCounterIndex: number, counterNames: CounterName[]) => { // maybe send it in as other props because it is needed there anyway
    props.navigation.navigate("CounterScreen", { initCounterIndex, counterNames });
  }

  return (
    <ScrollView>
      <TotalFieldGroup onPressed={nav}></TotalFieldGroup>
      <FieldGroup title="Farge" fields={colors} onPressed={nav} />
      <FieldGroup title="Slips" fields={ties} onPressed={nav} />

      <Button title="Finish" onPress={() => {
        // If map-first navigation flow was taken, the observation is now completed
        if (props.observation?.yourCoordinates && props.observation.sheepCoordinates) {
          props.finishObservation();
        }
        props.navigation.navigate("TripMapScreen");
      }} />
    </ScrollView>
  )
}

export default connector(FormScreen);
