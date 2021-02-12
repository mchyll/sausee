import React, { useState } from "react";
import { LayoutRectangle, View, StyleSheet } from "react-native";
import Svg, { Defs, Path, Pattern } from "react-native-svg";


export const MapCutoutHatchPattern = () => {
  const padding = 25;
  // const color = "rgba(159,100,255,0.5)";
  const color = "rgba(0,100,200,0.4)";

  const [{ width: w, height: h }, setLayout] = useState<LayoutRectangle>({ width: 0, height: 0, x: 0, y: 0 });

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={e => setLayout(e.nativeEvent.layout)}>

      <Svg width={w} height={h}>
        <Defs>
          <Pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse">
            <Path d="M0 10 L10 0 H5 L0 5 M10 10 V5 L5 10" fill={color} />
          </Pattern>
        </Defs>

        <Path fill="url(#hatch)" fillRule="evenodd"
          d={`M0 0 H${w} V${h} H0 Z M${padding} ${padding} H${w - padding} V${h - padding} H${padding} Z`}
        />

        <Path fill={color} fillRule="evenodd" d={
          `M${padding} ${padding} H${w - padding} V${h - padding} H${padding} Z ` +
          `M${padding + 4} ${padding + 4} H${w - padding - 4} V${h - padding - 4} H${padding + 4} Z`}
        />
      </Svg>
    </View>
  )
};
