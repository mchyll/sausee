import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { changeObservationDescription } from "../shared/ActionCreators";
import { SauseeState } from "../shared/TypeDefinitions";
import { formStyles } from "./FormStyles";


const connector = connect((state: SauseeState) => ({
  description: state.currentObservation?.type === "INJURED_SHEEP" || state.currentObservation?.type === "DEAD_SHEEP" ?
    state.currentObservation.description :
    undefined,
  editable: state.currentObservation?.editable ?? false
}), {
  changeObservationDescription
});

function ObservationDescriptionFormField(props: ConnectedProps<typeof connector>) {
  return <>
    <Text style={formStyles.groupTitle}>Beskrivelse</Text>
    <View style={[formStyles.group, styles.descriptionContainer]}>
      <TextInput
        multiline
        editable={props.editable}
        style={styles.descriptionTextInput}
        hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
        defaultValue={props.description}
        onChangeText={props.changeObservationDescription}
      />
    </View>
  </>
}

const styles = StyleSheet.create({
  descriptionContainer: {
    padding: 15
  },
  descriptionTextInput: {
    fontSize: 16,
    minHeight: 50
  }
});

export default connector(ObservationDescriptionFormField);
