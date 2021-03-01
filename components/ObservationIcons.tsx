import React from "react";
import { Image, ImageStyle } from "react-native";
import { MaterialIcons, MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';


interface ObservationIconProps {
  size: number,
  style?: ImageStyle
}

export const AddLocationIcon = ({ size, style }: ObservationIconProps) =>
  <MaterialIcons name="add-location" size={size} style={style} />

export const MultipleSheepIcon = ({ size, style }: ObservationIconProps) =>
  <Image style={{ resizeMode: "contain", width: size, height: size, ...style }} source={require("../assets/multiple-sheep.png")} />

export const PredatorIcon = ({ size, style }: ObservationIconProps) =>
  <Image style={{ resizeMode: "contain", width: size, height: size, ...style }} source={require("../assets/wolf-filled.png")} />

export const InjuredSheepIcon = ({ size, style }: ObservationIconProps) =>
  <Image style={{ resizeMode: "contain", width: size, height: size, ...style }} source={require("../assets/bandage.png")} />
// <MaterialCommunityIcons name="bandage" size={size} color="black" />
// <Ionicons name="bandage-outline" size={size} color="black" />

export const DeadSheepIcon = ({ size, style }: ObservationIconProps) =>
  <Ionicons name="skull" size={size} color="black" style={style} />
