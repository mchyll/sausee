import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ProgressViewIOSComponent, ScrollView, TouchableOpacity, View } from "react-native";

interface SwipeCounterProps {
  onAdd: () => void,
  onSubtract: () => void,
  /*name: string,
  count: number,*/
}
function SwipeCounter(props: SwipeCounterProps) {
  const scrollViewRef = useRef<ScrollView>(null); // schnedig

  //const [count, setCount] = useState(0);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({x: 0, y: Dimensions.get("window").height, animated: true });
  })

  return <ScrollView
    ref = {scrollViewRef}
    pagingEnabled = {true}
    onMomentumScrollEnd = {(e) => {
      const position = e.nativeEvent.contentOffset.y
      if(position === 0) {
        props.onSubtract();
        console.log("- minus");
      }
      else if (position === Dimensions.get("window").height * 2) {
        props.onAdd();
        console.log("+ pluss");
      }
      scrollViewRef.current?.scrollTo({x: 0, y: Dimensions.get("window").height, animated: true });
    }}
  >
    <TouchableOpacity
      onPress={() => {
        console.log("Pressed red")
        props.onSubtract();
      }}
    >
      <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 1.3, backgroundColor: 'red' }} />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        console.log("Pressed green")
        props.onAdd();
      }}
    >
      <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 1.7, backgroundColor: 'green' }} />
    </TouchableOpacity>
  </ScrollView>

}


export default SwipeCounter;