import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";


interface SettingsIconButtonProps {
  onPress: () => void
}

export const SettingsIconButton = ({ onPress }: SettingsIconButtonProps) =>
  <TouchableOpacity
    onPress={onPress}
    style={styles.button}
  >
    <MaterialIcons name="settings" size={26} color="black" />
  </TouchableOpacity>

const styles = StyleSheet.create({
  button: {
    // backgroundColor: "rgba(0, 255, 0, 0.5)",
    height: Platform.OS === "ios" ? 40 : "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: Platform.OS === "ios" ? 0 : 11
  }
});
