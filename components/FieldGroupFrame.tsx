import React from "react";
import { View, StyleSheet, Text } from "react-native";

interface FieldGroupFrameProps {
  title: string,
}

const FieldGroupFrame: React.FunctionComponent<FieldGroupFrameProps> = props => {
  return <View style={styles.box}>
    <Text style={{margin: 10}}>{props.title}</Text>
    <View style={styles.childWrapper}>
      {props.children}
    </View>
  </View>
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 3,
    borderRadius: 20,
    //justifyContent: "center",
    //alignItems: "center",
    margin: 10
  },
  childWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    //alignItems: "space-"
    
  }
})


export default FieldGroupFrame;