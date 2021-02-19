import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Pressable, Platform } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { ScreenName } from "../shared/TypeDefinitions";
import { Modal, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';



export interface IconButtonProps {
  screenName: ScreenName;
}

export const HelpButton = (props: React.PropsWithChildren<IconButtonProps>) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.circularTouchable}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="questioncircleo" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        statusBarTranslucent={true}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          style={StyleSheet.absoluteFill}
        >
          <View style={{ ...styles.centeredView, backgroundColor: "rgba(0, 0, 0, 0.65)" }}>
            <Pressable onPress={e => e.preventDefault()}>
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
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
// todo: add button at the bottom that closes modal? Could have an emoji in addition to text to make it more nice :)


const styles = StyleSheet.create({
  circularTouchable: {
    // borderWidth: 1,
    // borderColor: 'rgba(255,0,0,0.3)',
    ...Platform.select({
      ios: null,
      default: {
        marginHorizontal: 11,
      },
    }),
    // alignItems: 'center',
    // justifyContent: 'center',
    // width: 60,
    // marginRight: 5,
    // height: "100%",
    //backgroundColor: '#fff',
    //borderRadius: 30,
    //position: "absolute",
    // bottom: 7,
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
    // marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
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
      return "Når du er ute på oppsynstur kan det hende at du ikke har mobildekning. Kartet må derfor lastes ned på forhånd.\n\n\
      Kartet som vises på skjermen er det som lastes ned.\n\n\
      Zoom inn slik at kun den delen av kartet du trenger vises på skjermen og trykk på knappen nederst til høyre.";

    case "TripMapScreen": // todo: is it written "plasser" or "plassér"?
      return "Plassér siktet/krysset over der du ser sauene og trykk på knappen nederst til høyre på skjermen.\n\n\
      Hvor du står selv blir registrert automatisk.\n\n\
      For å redigere en tidligere observasjon, trykker man på saue-ikonet for den tidligere observasjonen.";

    case "SheepFormScreen":
      return "Oversikten viser hva du har telt så langt i denne observasjonen. Trykk på et av feltene for å endre verdien.\n\n\
      Observasjonen lagres automatisk når du går tilbake til kartet.\n\n\
      Returner til kartet for å legge inn en ny observasjon.";

    case "CounterScreen":
      return "Trykk på det grønne eller røde feltet for å legge til eller trekke fra. Du kan også sveipe opp eller ned for å telle.\n\n\
      Sveip til høyre eller venstre for å bytte på hva du teller.";

    default:
      return "Dette skjermbildet var av uante grunner ikke registrert hos oss. Ta kontakt hvis du trenger hjelp." // todo: formulate better
  }
}