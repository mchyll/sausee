import React, { useRef } from "react";
import { PanResponder, StyleSheet, View } from "react-native";


export const PanResponderTestScreen = () => {

  const moveCount = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        console.log(`onMoveShouldSetPanResponder   dx ${gestureState.dx}   dy ${gestureState.dy}`);
        return Math.abs(gestureState.dx) > 50 || Math.abs(gestureState.dy) > 50;
      },
      onStartShouldSetPanResponder: (event, gestureState) => {
        console.log("onStartShouldSetPanResponder");
        return false;
      },
      onPanResponderGrant: (event, gestureState) => console.log("onPanResponderGrant"),
      onPanResponderMove: (event, gestureState) => moveCount.current++,//console.log("onPanResponderMove"),
      onPanResponderRelease: (event, gestureState) => { console.log(`onPanResponderRelease   moveCount ${moveCount.current}\n`); moveCount.current = 0 },
      onPanResponderTerminate: (event, gestureState) => console.log("onPanResponderTerminate"),

      onMoveShouldSetPanResponderCapture: (event, gestureState) => {
        console.log("onMoveShouldSetPanResponderCapture");
        return true;
      },
      onStartShouldSetPanResponderCapture: (event, gestureState) => {
        console.log("onStartShouldSetPanResponderCapture");
        return false;
      },
      onPanResponderReject: (event, gestureState) => console.log("onPanResponderReject"),
      onPanResponderStart: (event, gestureState) => console.log("onPanResponderStart", gestureState.stateID),
      onPanResponderEnd: (event, gestureState) => console.log("onPanResponderEnd"),
      onPanResponderTerminationRequest: (event, gestureState) => {
        console.log("onPanResponderTerminationRequest");
        return true;
      },
      onShouldBlockNativeResponder: (event, gestureState) => {
        console.log("onShouldBlockNativeResponder");
        return false;
      },
    })
  ).current;

  return <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill}></View>
}
