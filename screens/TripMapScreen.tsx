import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation, addRoutePathCoordinates } from "../shared/ActionCreators";
import { Button, View, Image } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { TripMapComponent } from "../components/TripMapComponent";
import * as Location from "expo-location";



const mapStateToProps = (state: SauseeState) => {
  const trip = state.trips.find((trip) => trip.id === state.currentTripId);
  // todo: looks like there is an infinite loop with adding route path coordinates
  //console.log("id:" + trip?.id);
  console.log("observations:" + trip?.observations);
  //console.log("timestamp:" + trip?.timestamp);
  //console.log("Trip path: " + trip?.routePath);

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
  const [sheepLocation, setSheepLocation] = useState({ lat: 0, lon: 0 });
  const [currentUserLocation, setCurrentUserLocation] = useState({ lat: 0, lon: 0 });

  useEffect(() => { // todo: wrong hook?
    Location.startLocationUpdatesAsync("BackgroudLocationTracker", {
      accuracy: Location.Accuracy.Balanced,
      foregroundService: {
        notificationTitle: "Henter posisjon title",
        notificationBody: "Henter posisjon body"
      }
    }).catch(err => console.error(err));
  }, []); // only once

  return (<>
    <TripMapComponent
      onUserLocationChange={(locEvent) => {
        setCurrentUserLocation({ lat: locEvent.nativeEvent.coordinate.latitude, lon: locEvent.nativeEvent.coordinate.longitude });
        //props.addRoutePathCoordinates(currentUserLocation);
      }}
      onSheepLocChangeComplete={(region) => (setSheepLocation({ lat: region.latitude, lon: region.longitude }))}
      routePath={props.trip?.routePath ?? []}
      sheepLocation={sheepLocation}
      currentUserLocation={currentUserLocation}
      prevObservations={props.trip?.observations ?? []}
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
        console.log(currentUserLocation);
        const lat = Math.random() * 180;
        props.beginObservation(currentUserLocation, sheepLocation);
        props.navigation.replace("FormScreen");
      }} />
    </View>
    <View pointerEvents="none" style={{ position: "absolute", justifyContent:"center", alignItems:"center", top:0, left:0, right:0, bottom:0 }}>
      <Image style={{ width: 100, height: 100, }} source={require("../assets/sniper.png")} />
    </View>
  </>);
}

export default connector(TripMapScreen);
