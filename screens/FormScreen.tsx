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

  let isColorNumCorrect = () => {
    const ob = props.observation;
    const whiteGrey = ob?.whiteGreySheepCount ?? 0;
    const black = ob?.blackSheepCount ?? 0;
    const brown = ob?.brownSheepCount ?? 0;
    const colorSum = whiteGrey + black + brown;
    const sheepTotal = ob?.sheepCountTotal ?? 0;
    return sheepTotal === colorSum;
  }

  let isTiesCorrect = () => {
    const ob = props.observation;
    const sheepTotal = ob?.sheepCountTotal ?? 0;
    const redTie = ob?.redTieCount ?? 0;
    const blueTie = ob?.blueTieCount ?? 0;
    const greenTie = ob?.greenTieCount ?? 0;
    const yellowTie = ob?.yellowTieCount ?? 0;
    const missingTie = ob?.missingTieCount ?? 0;
    const eweCount = redTie + blueTie + greenTie + yellowTie + missingTie;

    // blue equals 0 lambs
    // no tie is calculated the same as 0 lambs since it is unknown
    const lambCount = greenTie + yellowTie * 2 + redTie * 3;
    console.log(lambCount);
    console.log(eweCount);

    return sheepTotal === eweCount + lambCount;
  }

  const isCloseToSheep = () => { // maybe use Vincenty's formulae istead? It takes earth's shape more into account https://en.wikipedia.org/wiki/Vincenty%27s_formulae
    const sc = props.observation?.sheepCoordinates ?? { latitude: 0, longitude: 0 };
    const yc = props.observation?.yourCoordinates ?? { latitude: 0, longitude: 0 };
    console.log("sheep location")
    console.log(sc);
    console.log("your location")
    console.log(yc);
    const r = 6371000 // meter. Source: googleing "radius earth", and google showing it directly
    // Haversine formula. Source: https://en.wikipedia.org/wiki/Haversine_formula
    const distance = 2 * r * Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((sc?.latitude - yc?.latitude) / 2), 2)
        + Math.cos(sc.latitude) * Math.cos(yc.latitude)
        * Math.pow(Math.sin((sc?.longitude - yc?.longitude) / 2), 2)
      )
    )
    console.log("Distance: " + distance);
    return distance < 50;
  }

  const startForm = isCloseToSheep() ? 0 : 1;


  const [formType, setFormType] = useState(startForm);
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

      {!isColorNumCorrect() ? <Text>farge feil</Text> : null}
      {!isTiesCorrect() && formType === 0 ? <Text>feil slips</Text> : null}

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
          /*if (!isDoneFar() || formType === 0 && !isDoneNear()) {
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
          } else*/ if (!isColorNumCorrect() || (!isTiesCorrect() && formType === 0)) {
            const colorText = !isColorNumCorrect() ? " farger, " : "";
            const tieText = (!isTiesCorrect() && formType === 0) ? "slips." : "";
            Alert.alert(
              "Feil i tellingen!",
              "Feil i: " + colorText + tieText,
              [
                {
                  text: "Fiks",
                  style: "cancel"
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
              ]
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
