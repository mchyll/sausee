import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


interface CloseIconButtonProps {
  onPress: () => void
}

export const CloseIconButton = ({ onPress }: CloseIconButtonProps) =>
  <TouchableOpacity onPress={onPress} style={styles.closeButton}>
    <View style={styles.closeButtonCircle}>
      <MaterialCommunityIcons name="close-thick" size={28} color="black" />
    </View>
  </TouchableOpacity>

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: "flex-start",
    zIndex: 10
  },
  closeButtonCircle: {
    margin: 10,
    padding: 5,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  }
});
