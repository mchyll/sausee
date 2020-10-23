import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';

interface ErrorBoxProps {
  message: String
}
const ErrorBox = (props: ErrorBoxProps) => (
  <View style={styles.box}>
    <View style={styles.iconContainer}>
      <AntDesign name="exclamationcircleo" size={30} color="black" />

    </View>
    <Text style={styles.message}>{props.message}</Text>
  </View>
)

const styles = StyleSheet.create({
  box: {
    backgroundColor: "red",
    marginLeft: 30,
    marginRight: 30,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row"
  },
  iconContainer: {
    margin:40
  },
  message: {
    fontWeight: "bold",
    flexWrap: "wrap"
  }
});

export default ErrorBox;