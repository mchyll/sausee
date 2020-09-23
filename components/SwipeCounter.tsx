import React, { useEffect, useRef } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface SwipeCounterProps {
  onChange: (name: string, change: number) => void,
  name: string,
  count: number,
}
function SwipeCounter(props: SwipeCounterProps) {
  const scrollViewRef = useRef<ScrollView>(null); // schnedig

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: Dimensions.get("window").height, animated: true });
  })

  return <ScrollView
    ref={scrollViewRef}
    pagingEnabled={true}
    onMomentumScrollEnd = {(e) => {
      const position = e.nativeEvent.contentOffset.y
      if (position === 0) {
        props.onChange(props.name, -1);
        console.log("- minus");
      }
      else if (position === Dimensions.get("window").height * 2) {
        props.onChange(props.name, 1);
        console.log("+ pluss");
      }
      //scrollViewRef.current?.scrollTo({ x: 0, y: Dimensions.get("window").height, animated: true });
    }}
  >
    <TouchableOpacity
      onPress={() => {
        console.log("Pressed red")
        props.onChange(props.name, -1);
      }}
    >
      <View style={styles.redBox}>
        <Text style={styles.textStyle}>-</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        console.log("Pressed green")
        props.onChange(props.name, 1);
      }}
    >
      <View style={styles.greenBox}>
        <Text style={styles.textStyle}>{props.name}</Text>
        <Text style={styles.textStyle}>{props.count}</Text>
        <Text style={styles.textStyle}>+</Text>
      </View>
    </TouchableOpacity>
  </ScrollView>

}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 80
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