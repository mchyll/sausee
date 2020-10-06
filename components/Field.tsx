import React from 'react';
import { TextInput, Text, View, TouchableHighlight, TouchableOpacity, StyleSheet } from "react-native";

interface FieldProps {
  description: string,
  value?: number,
  onPressed: () => void,
}

const Field = (props: FieldProps) => {
  let theValue = props.value;
  let extraStyle = {color: "black", borderColor: "green"}
  if(props.value === undefined) {
    theValue = 0;
    extraStyle.color = "grey";
    extraStyle.borderColor = "grey";
  }
  return (
    <TouchableOpacity onPress={props.onPressed}>
      <View style={styles.theView}>
        <Text style={{...styles.value, ...extraStyle}}>{theValue}</Text>
        <Text style={styles.description}>{props.description}</Text>

      </View>

    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  theView: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 3
  },
  value: {
    fontSize: 40,
    borderColor: "green",
    borderWidth: 2,
    textAlign: "center",
    minWidth: 90,
    minHeight: 70,
    paddingTop: 11,
    color: "black",
  },
  description: {
    margin: 5
  }
})

export default Field;