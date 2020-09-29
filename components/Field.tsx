import React from 'react';
import { TextInput, Text, View, TouchableHighlight, TouchableOpacity } from "react-native";

interface FieldProps {
  description: string,
  value: number,
  onPressed: () => void,
}

const Field = (props: FieldProps) => (
  <TouchableOpacity onPress={props.onPressed}>
    <View style={{flexDirection: "column", margin: 15}}>
      <Text style={{borderColor: "red", borderWidth: 2}}>{props.value}</Text>
      <Text>{props.description}</Text>
    </View>
  </TouchableOpacity>
  
);

export default Field;