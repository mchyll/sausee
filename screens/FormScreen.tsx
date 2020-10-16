import React, { useState } from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import { CounterName, RootStackParamList } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from "react-redux";
import { Pressable, ScrollView, Text, StyleSheet, View, Alert } from 'react-native';
import { finishObservation, cancelObservation } from "../shared/ActionCreators";
import { mapCurrentObservationToProps } from '../shared/Mappers';
import FarForm from '../components/FarForm';
import NearFormExtension from '../components/NearFormExtension';
import SegmentedControl from '@react-native-community/segmented-control';


const connector = connect(mapCurrentObservationToProps, { finishObservation, cancelObservation });

type FormScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "FormScreen"> // after & is external props

function FormScreen(props: FormScreenProps) { // todo: not hardcode counternames


  let nav = (initCounterIndex: number, counterNames: CounterName[]) => { // maybe send it in as other props because it is needed there anyway
    props.navigation.navigate("CounterScreen", { initCounterIndex, counterNames });
  }

  let isDoneFar = () => {
    const ob = props.observation;
    return ob?.sheepCountTotal != undefined
      && ob.whiteGreySheepCount != undefined
      && ob.blackSheepCount != undefined
      && ob.brownSheepCount != undefined;
  }

  let isDoneNear = () => {
    const ob = props.observation;
    return isDoneFar() && ob?.redTieCount != undefined
      && ob.blueTieCount != undefined
      && ob.greenTieCount != undefined
      && ob.yellowTieCount != undefined
      && ob.missingTieCount != undefined;
  }



  const [formType, setFormType] = useState(0);
  return (
    <ScrollView>
      <View style={{ margin: 10 }}>
        <SegmentedControl
          values={['Nær', 'Fjern']}
          selectedIndex={formType}
          onChange={(event) => {
            setFormType(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>

      <FarForm nav={nav} />
      {formType === 0 ? <NearFormExtension nav={nav} /> : null}



      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, padding: 20, marginBottom: 60 }}>
        <Pressable style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? 'red'
              : 'red'
          },
          styles.wrapperCustom
        ]} onPress={() => {
          props.cancelObservation();
          props.navigation.replace("TripMapScreen");
        }}>
          <Text style={{ fontSize: 30 }}>
            Avbryt
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
          if (!isDoneFar() || formType === 0 && !isDoneNear()) {
            Alert.alert(
              "Felt mangler verdi",
              "melding", // hvilke felt
              [
                {
                  text: "Fyll ut",

                },
                {
                  text: "Lever likevel",
                  onPress: () => {
                    if (props.observation?.yourCoordinates && props.observation.sheepCoordinates) {
                      props.finishObservation();
                    }
                    props.navigation.replace("TripMapScreen");
                  }
                }
              ],
              { cancelable: false } // only relevant for android
            )
          } else {
            if (props.observation?.yourCoordinates && props.observation.sheepCoordinates) {
              props.finishObservation();
            }
            props.navigation.replace("TripMapScreen");
          }
        }}>
          <Text style={{ fontSize: 30 }}>
            Fullfør
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
