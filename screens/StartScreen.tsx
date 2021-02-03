import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, View, Text, Button, Alert } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { finishTrip } from "../shared/ActionCreators";
import { RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { stopRouteTracking } from "../services/BackgroundLocationTracking";
import { deleteDirectoryFiles } from '../services/MapDownload';


const mapStateToProps = (state: SauseeState) => ({
  currentTripId: state.currentTripId,
});

const connector = connect(mapStateToProps, { finishTrip });

type StartScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "StartScreen">

const StartScreen = (props: StartScreenProps) => {
  return (
    <View style={{ justifyContent: "space-evenly" }}>
      <View style={{ alignItems: "center", }}>
        <Pressable
          onPress={() => {
            if (props.currentTripId === null) {
              props.navigation.navigate("DownloadMapScreen");
            } else {
              props.navigation.navigate("TripMapScreen");
            }
          }}
        >
          <Image
            source={require("../assets/sheep_1.png")}
            style={{ width: 350, height: 350 }}
          />
        </Pressable>
      </View>

      <View style={{ alignItems: "center" }}>
        {props.currentTripId === null ? <Text>Trykk på sauen for å starte en oppsynstur</Text> : <Text>Trykk på sauen for å fortsette oppsynsturen</Text>}
      </View>
      {props.currentTripId && <Button
        title={"Avslutt oppsynstur"}
        onPress={() => {
          Alert.alert("Avslutt oppsynstur", "Er du sikker?", [
            { text: "Avbryt", style: "cancel" },
            {
              text: "OK", onPress: () => {
                props.finishTrip();
                stopRouteTracking();
              }
            }
          ]);
        }}
      />}
      <Button title="Slett kartfiler" onPress={deleteDirectoryFiles}/>
    </View>
  )
}

export default connector(StartScreen);
