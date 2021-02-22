import React from "react";
import { Text } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { connect, ConnectedProps } from "react-redux";
import { mapCurrentSheepObservationToProps } from "../shared/Mappers";
import { RootStackParamList } from "../shared/TypeDefinitions";
import FormScreenFrame from "./FormScreenFrame";

const connector = connect(mapCurrentSheepObservationToProps, {});

function InjuredSheepFormScreen(props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "InjuredSheepFormScreen">) {
  return (
    <FormScreenFrame navigation={props.navigation}>
      <Text>Hei</Text>
      <Text>Ho</Text>
    </FormScreenFrame>
  );
}

export default connector(InjuredSheepFormScreen);
