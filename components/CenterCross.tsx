import React, { useState } from "react";
import { View, LayoutRectangle, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export const CenterCross = () => {
  const [{ width: w, height: h }, setLayout] = useState<LayoutRectangle>({ width: 0, height: 0, x: 0, y: 0 });

  return <View
    pointerEvents="none"
    style={StyleSheet.absoluteFill}
    onLayout={e => setLayout(e.nativeEvent.layout)}
  >
    <Svg width={w} height={h}>
      <Path d={`M 0 0 L${w} ${h} M${w} 0 L0 ${h}`} stroke="rgba(0, 0, 0, 0.3)" strokeWidth={1} />
    </Svg>
  </View>
};

export const debugStyles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderColor: "red",
    // borderStyle: "dashed",
    backgroundColor: "rgba(0, 255, 255, 0.3)"
  }
})