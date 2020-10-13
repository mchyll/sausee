import React, { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState, Coordinates } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation, addRoutePathCoordinates } from "../shared/ActionCreators";
import { Button, Text, View, Image } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { TripMapComponent } from "../components/TripMapComponent";
import { Region } from "react-native-maps";


const mapStateToProps = (state: SauseeState) => {
  const trip = state.trips.find((trip) => trip.id === state.currentTripId);
  // todo: looks like there is an infinite loop with adding route path coordinates
  //console.log("id:" + trip?.id);
  console.log("observations:" + trip?.observations);
  //console.log("timestamp:" + trip?.timestamp);
  //console.log("Trip path: " + trip?.routePath);
  if (!trip?.observations) console.log("NO STUFFS!")

  return {
    /** Flag telling if the map screen is presented at the end of the form-first navigation flow */
    endOfFormFirstFlow: !!state.currentObservationId && !state.trips
      .find(t => t.id === state.currentTripId)?.observations
      .find(o => o.id === state.currentObservationId)?.sheepCoordinates,
    trip: trip

  };
}

const connector = connect(mapStateToProps, { beginObservation, finishObservation, addRoutePathCoordinates });

type TripMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

// todo: initial region
const TripMapScreen = (props: TripMapScreenProps) => {
  const [sheepLocation, setSheepLocation] = useState({ latitude: 0, longitude: 0 });

  return (<>
    <TripMapComponent
      onUserLocationChange={(locEvent) => {
        props.addRoutePathCoordinates({ latitude: locEvent.nativeEvent.coordinate.latitude, longitude: locEvent.nativeEvent.coordinate.longitude });
      }}
      onSheepLocChangeComplete={setSheepLocation}
      sheepLocation={sheepLocation}
      currentUserLocation={props.trip?.routePath[props.trip?.routePath.length - 1] ?? { latitude: 0, longitude: 0 }}
    />
    <View style={{ backgroundColor: "red", borderWidth: 1, position: 'absolute', top: 80, left: 20 }} >
      <Button title="Location later" color="black" onPress={() => {
        props.beginObservation();
        props.navigation.navigate("FormScreen");
      }} />
    </View>
    <View style={{ backgroundColor: "green", borderWidth: 1, position: 'absolute', top: 80, right: 20 }} >
      <Button color="black" title="Set position" onPress={() => {
        console.log(sheepLocation);
        console.log(props.trip?.routePath[props.trip?.routePath.length - 1]);
        props.beginObservation(props.trip?.routePath[props.trip?.routePath.length - 1], sheepLocation);
        props.navigation.replace("FormScreen");
      }} />
    </View>
    <View pointerEvents="none" style={{ position: "absolute", justifyContent: "center", alignItems: "center", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Image style={{ width: 100, height: 100, }} source={require("../assets/sniper.png")} />
    </View>
  </>);
}

export default connector(TripMapScreen);
