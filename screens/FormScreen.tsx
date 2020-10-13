import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import FieldGroup from "../components/FieldGroup";
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from "react-redux";
import { Button, Pressable, ScrollView, Text, StyleSheet, View } from 'react-native';
import TotalFieldGroup from '../components/TotalFieldGroup';
import { finishObservation, cancelObservation } from "../shared/ActionCreators";
import { mapCurrentObservationToProps } from '../shared/Mappers';


const connector = connect(mapCurrentObservationToProps, { finishObservation, cancelObservation });

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

      <View style={{ flexDirection: "row", justifyContent:"space-around", marginTop:20, padding:20, marginBottom:60}}>
        <Pressable style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? 'red'
              : 'red'
          },
          styles.wrapperCustom
        ]} onPress={() => {
          if (props.observation?.yourCoordinates && props.observation.sheepCoordinates) {
            props.cancelObservation();
          }
          props.navigation.replace("TripMapScreen");
        }}>
          <Text style={{fontSize:30}}>
            Cancel
        </Text>
        </Pressable>
        <Pressable style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? 'green'
              : 'green'
          },
          styles.wrapperCustom
        ]} onPress={() => {
          if (props.observation?.yourCoordinates && props.observation.sheepCoordinates) {
            props.finishObservation();
          }
          props.navigation.replace("TripMapScreen");
        }}>
          <Text style={{fontSize:30}}>
            Finish
        </Text>
        </Pressable>

      </View>

    </ScrollView>
  )
}

// todo clean up styles
const styles = StyleSheet.create({
  text: {
    fontSize: 16
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9'
  }
});

export default connector(FormScreen);
