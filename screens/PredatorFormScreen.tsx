import React, { useEffect, useState } from "react";
import { Dimensions, Text, TextInput, View, Image, Platform } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { connect, ConnectedProps } from "react-redux";
import { RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import FormScreenFrame from "./FormScreenFrame";
import { Picker, PickerIOS } from '@react-native-picker/picker';
import { setPredatorSpecies, setPredatorCount } from "../shared/ActionCreators";


export const mapCurrentObservationToProps = (state: SauseeState) => ({
  observation: state.currentObservation?.type === "PREDATOR" ? state.currentObservation : null
});

const connector = connect(mapCurrentObservationToProps, { setPredatorSpecies, setPredatorCount });

function PredatorFormScreen(props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "PredatorFormScreen">) {
  const predefinedPredators = ["jerv", "ulv", "bjørn", "kongeørn", "havørn"];
  const isPredefinedPreditor = predefinedPredators.includes(props.observation?.species ?? "");
  const [showOther, setShowOther] = useState(!isPredefinedPreditor);

  const countNumber = props.observation?.count ?? 1;
  const countString = countNumber.toString();
  const other = "annet";

  let selectedValue;
  if (predefinedPredators.includes(props.observation?.species ?? ""))
    selectedValue = props.observation?.species;
  else {
    selectedValue = other;
  }
  return (
    <FormScreenFrame navigation={props.navigation}>
      <View style={{ flexDirection: "row", margin: 8 }}>
        <Image style={{ resizeMode: "contain", width: 60, height: 60 }} source={require("../assets/wolf-filled.png")} />
        <Text style={{ fontSize: 40 }}>Rovdyr</Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 0, marginBottom: 70 }}>
        <Picker
          selectedValue={selectedValue}
          style={{ height: 200, width: Platform.OS == "ios" ? 200 : 100, }}
          onValueChange={(itemValue, itemIndex) => {
            if (itemValue.toString() === "annet") setShowOther(true);
            else setShowOther(false);
            props.setPredatorSpecies(itemValue.toString());
          }}
        >
          <Picker.Item label="Jerv" value="jerv" />
          <Picker.Item label="Ulv" value="ulv" />
          <Picker.Item label="Bjørn" value="bjørn" />
          <Picker.Item label="Kongeørn" value="kongeørn" />
          <Picker.Item label="Havørn" value="havørn" />
          <Picker.Item label="Annet" value="annet" />
        </Picker>
        {showOther &&
          <View style={{ width: Dimensions.get("window").width * 2 / 3, flexDirection: "row", flexGrow: 1, justifyContent: "space-evenly", alignItems: "center", marginTop: 40 }}>
            <Text>Rovdyrart:</Text>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 100, textAlign: "center" }}
              onChangeText={text => props.setPredatorSpecies(text)}
              value={props.observation?.species}
            />
          </View>}
        <View style={{ width: Dimensions.get("window").width * 2 / 3, flexDirection: "row", flexGrow: 1, justifyContent: "space-evenly", alignItems: "center", marginTop: 40 }}>
          <Text>Antall dyr:</Text>
          <TextInput
            keyboardType="numeric"
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 100, textAlign: "center" }}
            onChangeText={text => props.setPredatorCount(parseInt(text))}
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