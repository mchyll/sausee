import React, { useEffect, useRef } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { CounterName } from "../shared/TypeDefinitions";
import * as Speech from 'expo-speech';
import { observationKtsn } from "../key_to_speech_name/ObservationKtsn";

interface SwipeCounterProps {
  onChange: (name: CounterName, change: number) => void,
  name: CounterName,
  count?: number,
}
function SwipeCounter(props: SwipeCounterProps) {
  const scrollViewRef = useRef<ScrollView>(null); // schnedig

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: Dimensions.get("window").height, animated: true }); // todo: not animate when navigating from form
  })

  const change = (name:CounterName, change: number) => {
    Speech.stop();
    let toSay: string = "Ikke satt";
    if(change === 1) toSay = "pluss"
    else if(change === -1) toSay = "minus";
    let theCount: number = props.count ?? 0;
    let num: number = theCount + change;

    Speech.speak(toSay);
    Speech.speak("Det er nå " + num + " " + observationKtsn[props.name]);
    //Speech.speak("Dette er det norske språket", {voice: "com.apple.ttsbundle.Nora-compact"});
    //Speech.speak("This is the english language", { voice: "com.apple.ttsbundle.siri_female_en-US_compact"});
    props.onChange(props.name, change);
  }

  return <ScrollView
    ref={scrollViewRef}
    pagingEnabled={true}
    onMomentumScrollEnd = {(e) => {
      const position = e.nativeEvent.contentOffset.y
      if (position === 0) {
        change(props.name, -1);
        console.log("Scrolled - minus");
      }
      else if (position === Dimensions.get("window").height * 2) {
        change(props.name, 1);
        console.log("Scrolled + pluss");
      }
    }}
  >
    <TouchableOpacity
      onPress={() => {
        change(props.name, -1);
        console.log("Pressed red")
      }}
    >
      <View style={styles.redBox}>
        <Text style={styles.textStyle}>-</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        change(props.name, 1);
        console.log("Pressed green")
      }}
    >
      <View style={styles.greenBox}>
        <Text style={styles.textStyle}>{observationKtsn[props.name]}</Text>
        <Text style={styles.textStyle}>{props.count}</Text> 
        <Text style={styles.textStyle}>+</Text>
      </View>
    </TouchableOpacity>
  </ScrollView>
}

/* todo: ?? 0 in prod. Now better without because debugging*/
const styles = StyleSheet.create({
  textStyle: {
    fontSize: 70
  },
  redBox: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 1.3,
    backgroundColor: 'red',
    flexDirection: "column-reverse"
  },
  greenBox: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 1.7,
    backgroundColor: 'green'
  }
})


export default SwipeCounter;
