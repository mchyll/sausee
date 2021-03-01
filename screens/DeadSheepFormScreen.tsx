import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../shared/TypeDefinitions";
import FormScreenFrame from "./FormScreenFrame";
import ObservationPhotosFormField from "../components/PhotosFormField";
import ObservationDescriptionFormField from "../components/DescriptionFormField";
import { FormTypeHeader } from "../components/FormTypeHeader";
import { StyleSheet, Text } from "react-native";
import { formStyles } from "../components/FormStyles";


export default function DeadSheepFormScreen(props: StackScreenProps<RootStackParamList, "DeadSheepFormScreen">) {
  return (
    <FormScreenFrame navigation={props.navigation}>

      <FormTypeHeader formType="DEAD_SHEEP" />

      <Text style={styles.noteText}>Ta med øremerket til sauen, eller ta et bilde av det om dette ikke lar seg gjøre</Text>
      <ObservationDescriptionFormField />

      <ObservationPhotosFormField />

    </FormScreenFrame>
  );
}

const styles = StyleSheet.create({
  noteText: {
    ...formStyles.labelColor,
    ...formStyles.elementMargin,
    marginTop: -15,
    marginBottom: 30,
    fontWeight: "bold"
  }
});
