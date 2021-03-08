import React, { useState } from "react";
import { Dimensions, Text, TextInput, View, Platform } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { connect, ConnectedProps } from "react-redux";
import { RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import FormScreenFrame from "./FormScreenFrame";
import { Picker } from '@react-native-picker/picker';
import { setPredatorSpecies, setPredatorCount } from "../shared/ActionCreators";
import { FormTypeHeader } from "../components/FormTypeHeader";


export const mapCurrentObservationToProps = (state: SauseeState) => ({
  observation: state.currentObservation?.type === "PREDATOR" ? state.currentObservation : null,
  editable: state.currentObservation?.editable ?? false
});

const connector = connect(mapCurrentObservationToProps, { setPredatorSpecies, setPredatorCount });

function PredatorFormScreen(props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "PredatorFormScreen">) {
  const predefinedPredators = ["jerv", "ulv", "bjørn", "kongeørn", "havørn"];
  const isPredefinedPreditor = predefinedPredators.includes(props.observation?.species ?? "");
  const [showOther, setShowOther] = useState(!isPredefinedPreditor);

  const countNumber = props.observation?.count ?? 1;
  let countString;
  if (countNumber === -1) countString = "";
  else countString = countNumber.toString();
  const other = "annet";

  let selectedValue = other;
  if (props.observation && predefinedPredators.includes(props.observation.species))
    selectedValue = props.observation.species;

  const initPickerIndex = predefinedPredators.indexOf(selectedValue);
  const [previousPickerIndex, setPreviousPickerIndex] = useState(initPickerIndex < 0 ? predefinedPredators.length : initPickerIndex);

  const parseAndSetPredatorCount = (text: string) => {
    const parsedInt = parseInt(text);
    if (isNaN(parsedInt)) {
      props.setPredatorCount(-1);
    }
    else {
      props.setPredatorCount(parsedInt);
    }
  }

  return (
    <FormScreenFrame navigation={props.navigation} addBottomScrollingBoxIos>

      <FormTypeHeader formType="PREDATOR" />

      <View style={{
        alignItems: "center",
        marginTop: 0,
        marginBottom: Platform.OS == "ios" ? 50 : 0,
      }}>
        <Picker
          enabled={props.editable}
          selectedValue={selectedValue}
          style={{
            height: Platform.OS == "ios" ? 170 : 50,
            width: Platform.OS == "ios" ? 200 : 150,
            marginBottom: Platform.OS == "ios" ? 0 : 20,
          }}
          onValueChange={(itemValue, itemIndex) => {
            if (previousPickerIndex === itemIndex || !props.editable) return;
            if (itemValue.toString() === other) setShowOther(true);
            else setShowOther(false);
            props.setPredatorSpecies(itemValue);
            setPreviousPickerIndex(itemIndex);
          }}
        >
          <Picker.Item label="Jerv" value="jerv" />
          <Picker.Item label="Ulv" value="ulv" />
          <Picker.Item label="Bjørn" value="bjørn" />
          <Picker.Item label="Kongeørn" value="kongeørn" />
          <Picker.Item label="Havørn" value="havørn" />
          <Picker.Item label="Annet" value={other} />
        </Picker>

        {showOther &&
          <View style={{
            width: Dimensions.get("window").width * 2 / 3,
            flexDirection: "row",
            flexGrow: 1,
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: Platform.OS == "ios" ? 40 : 0,
          }}>
            <Text>Rovdyrart:</Text>
            <TextInput
              editable={props.editable}
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                width: 100,
                textAlign: "center"
              }}
              onChangeText={text => props.setPredatorSpecies(text)}
              value={props.observation?.species}
            />
          </View>}
        <View style={{
          width: Dimensions.get("window").width * 2 / 3,
          flexDirection: "row",
          flexGrow: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: showOther ? 20 : Platform.OS == "ios" ? 50 : 0,
          marginBottom: Platform.OS === "ios" ? 0 : 40
        }}>
          <Text>Antall dyr:</Text>
          <TextInput
            editable={props.editable}
            keyboardType="numeric"
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              width: 100,
              textAlign: "center"
            }}
            onChangeText={parseAndSetPredatorCount}
            value={countString}
          />
        </View>

      </View>

    </FormScreenFrame>
  );
}

export default connector(PredatorFormScreen);
/*
<View>

      </View>
*/