import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, GestureResponderEvent, ViewStyle, Pressable } from "react-native";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { ScreenName } from "../shared/TypeDefinitions";
import { Modal, Text, View, TouchableHighlight } from 'react-native';
import { Entypo } from '@expo/vector-icons';



export interface IconButtonProps {
  screenName: ScreenName;
}

export const HelpButton = (props: React.PropsWithChildren<IconButtonProps>) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={{ ...styles.circularTouchable }}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="questioncircleo" size={24} color="black" />

      </TouchableOpacity>
      <Modal
        animationType="none"
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{helpText(props.screenName)}</Text>

            <Pressable
              hitSlop={40}
              style={{ ...styles.closeButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Entypo name="cross" size={24} color="black" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
// todo: add button at the bottom that closes modal? Could have an emoji in addition to text to make it more nice :)


const styles = StyleSheet.create({
  circularTouchable: {
    //borderWidth: 1,
    //borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    //backgroundColor: '#fff',
    //borderRadius: 30,
    //position: "absolute",
    //bottom: 25,
    //left: 25
  },
  buttonIcon: {
    fontSize: 30,
    color: "black"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  closeButton: {
    position: "absolute",
    right: -12,
    top: -12,
    backgroundColor: "#F194FF",
    borderRadius: 50,
    padding: 5,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
});

// todo: headlines?
const helpText = (screenName: ScreenName) => {
  switch (screenName) {
    case "DownloadMapScreen":
      return "Kartet som vises på skjermen er det som lastes ned.\n\n\
      Zoom inn slik at kun den delen av kartet du trenger vises på skjermen og trykk på knappen nederst til høyre.";
    case "TripMapScreen": // todo: is it written "plasser" or "plassér"?
      return "Plassér siktet/krysset over der du ser sauene og trykk på knappen nederst til høyre på skjermen.\n\n\
      Hvor du står selv blir registrert automatisk.\n\n\
      For å redigere en tidligere observasjon, trykker man på saue-ikonet for den tidligere observasjonen.";
    default:
      return "Dette skjermbildet var av uante grunner ikke registrert hos oss. Ta kontakt hvis du trenger hjelp." // todo: formulate better
  }
}