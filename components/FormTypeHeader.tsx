import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ObservationTypeDescriptions } from "../shared/Descriptions";
import { Observation } from "../shared/TypeDefinitions";
import { formStyles } from "./FormStyles";
import { DeadSheepIcon, InjuredSheepIcon, MultipleSheepIcon, PredatorIcon } from "./ObservationIcons";


interface FormTypeHeaderProps {
  formType: Observation["type"];
}

export function FormTypeHeader({ formType }: FormTypeHeaderProps) {
  return (
    <View style={styles.formTypeHeader}>
      <View style={styles.formTypeHeaderIconContainer}>
        {formType === "SHEEP" && <MultipleSheepIcon size={24} style={formStyles.labelColor} />}
        {formType === "PREDATOR" && <PredatorIcon size={24} style={formStyles.labelColor} />}
        {formType === "INJURED_SHEEP" && <InjuredSheepIcon size={20} style={formStyles.labelColor} />}
        {formType === "DEAD_SHEEP" && <DeadSheepIcon size={20} style={formStyles.labelColor} />}
      </View>
      <Text style={styles.formTypeHeaderText}>
        {ObservationTypeDescriptions[formType]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  formTypeHeader: {
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center"
  },
  formTypeHeaderIconContainer: {
    // backgroundColor: "white",
    borderRadius: 5,
    // padding: 6
  },
  formTypeHeaderText: {
    ...formStyles.labelColor,
    fontSize: 20,
    marginLeft: 10,
  },
});
