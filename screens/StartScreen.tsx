import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, View, Text, Button, Alert } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { createTrip, finishTrip } from "../shared/ActionCreators";
import { RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { isRouteTracking, ROUTE_TRACKER_TASK_NAME, stopRouteTracking } from "../services/BackgroundLocationTracking";


const mapStateToProps = (state: SauseeState) => ({
  currentTripId: state.currentTripId,
});

const connector = connect(mapStateToProps, { createTrip, finishTrip });

type StartScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

// todo: initial region
const StartScreen = (props: StartScreenProps) => {
  return (
    <View style={{ justifyContent: "space-evenly" }}>
      <View style={{ alignItems: "center", }}>
        <Pressable
          onPress={() => {
            props.createTrip();
            props.navigation.navigate("DownloadMapScreen");
          }}
        >
          <Image
            source={require("../assets/sheep_1.png")}
            style={{ width: 350, height: 350 }}
          />
        </Pressable>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text>
          Trykk på sauen for å starte en oppsynstur
          </Text>
      </View>
      {props.currentTripId && <Button
        title={"Avslutt oppsynstur"}
        onPress={() => {
          Alert.alert("Avslutt oppsynstur", "Er du sikker?", [
            { text: "Avbryt", style: "cancel" },
            {
              text: "OK", onPress: () => {
                props.finishTrip();
                stopRouteTracking().then(() => props.navigation.replace("DownloadMapScreen"));
              }
            }
          ]);
        }}
      />}

    </View>
  )
}

export default connector(StartScreen);
