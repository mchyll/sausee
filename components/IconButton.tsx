import React from "react";
import { StyleSheet, TouchableOpacity, GestureResponderEvent, ViewStyle } from "react-native";
import { Feather } from '@expo/vector-icons';


export interface IconButtonProps {
  /**
   * Name of the Feather icon to show
   *
   * See Icon Explorer app
   * {@link https://expo.github.io/vector-icons/}
   */
  featherIconName?: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle
}

export const IconButton = (props: React.PropsWithChildren<IconButtonProps>) =>
  <TouchableOpacity
    style={{...styles.circularTouchable, ...props.style}}
    onPress={props.onPress}
  >
    {props.children ? props.children :
      <Feather name={props.featherIconName ?? ""} style={styles.buttonIcon} />
    }
  </TouchableOpacity>

const styles = StyleSheet.create({
  circularTouchable: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    //position: "absolute",
    //bottom: 25,
    //left: 25
  },
  buttonIcon: {
    fontSize: 30,
    color: "black"
  }
});
