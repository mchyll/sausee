import React from "react";
import { View, LayoutRectangle, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export const CenterCross = React.memo((props: { layout?: LayoutRectangle }) => {
  if (!props.layout) {
    return null;
  }
  const { width: w, height: h, x, y } = props.layout;
  if (w === undefined || h === undefined || x === undefined || y === undefined) {
    return null;
  }
  
  return <View pointerEvents="none"
    style={{ position: "absolute", top: y, left: x, bottom: h - y, right: w - x }}>
    <Svg width={w} height={h}>
      <Path d={`M 0 0 L${w} ${h} M${w} 0 L0 ${h}`} stroke="rgba(0, 0, 0, 0.3)" strokeWidth={1} />
    </Svg>
  </View>
});

export const debugStyles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderColor: "red",
    // borderStyle: "dashed",
    backgroundColor: "rgba(0, 255, 255, 0.3)"
  }
})