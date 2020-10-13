import React, { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation, addRoutePathCoordinates, finishTrip } from "../shared/ActionCreators";
import { Button, Text, View, Image, Alert } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { TripMapComponent } from "../components/TripMapComponent";
import { IconButton } from "../components/IconButton";


const mapStateToProps = (state: SauseeState) => {
  const trip = state.trips.find((trip) => trip.id === state.currentTripId);
  // todo: looks like there is an infinite loop with adding route path coordinates
  //console.log("id:" + trip?.id);
  // console.log("observations:" + trip?.observations);
  //console.log("timestamp:" + trip?.timestamp);
  //console.log("Trip path: " + trip?.routePath);
  if (!trip?.observations) console.log("NO STUFFS!")

  return {
    /** Flag telling if the map screen is presented at the end of the form-first navigation flow */
    endOfFormFirstFlow: !!state.currentObservationId && !state.trips
      .find(t => t.id === state.currentTripId)?.observations
      .find(o => o.id === state.currentObservationId)?.sheepCoordinates,

    currentUserLocation: trip?.routePath[trip?.routePath.length - 1] ?? { latitude: 0, longitude: 0 }
  };
}

const connector = connect(mapStateToProps, { beginObservation, finishObservation, addRoutePathCoordinates, finishTrip });

type TripMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

// todo: initial region
const TripMapScreen = (props: TripMapScreenProps) => {
  const [sheepLocation, setSheepLocation] = useState({ latitude: 0, longitude: 0 });

  const onFinishTripPress = () =>
    Alert.alert("Avslutt oppsynstur", "Er du sikker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "OK", onPress: () => {
          props.finishTrip();
          props.navigation.replace("DownloadMapScreen");
        }
      }
    ]);

  return (<>
    <TripMapComponent
      onUserLocationChange={(locEvent) => {
        props.addRoutePathCoordinates({ latitude: locEvent.nativeEvent.coordinate.latitude, longitude: locEvent.nativeEvent.coordinate.longitude });
      }}
      onSheepLocChangeComplete={setSheepLocation}
      sheepLocation={sheepLocation}
      currentUserLocation={props.currentUserLocation}
    />

    {props.endOfFormFirstFlow ? null :
      <View style={{ backgroundColor: "red", borderWidth: 1, position: 'absolute', top: 80, left: 20 }} >
        <Button title="Posisjon senere" color="black" onPress={() => {
          props.beginObservation();
          props.navigation.navigate("FormScreen");
        }} />
      </View>
    }

    <View style={{ backgroundColor: "green", borderWidth: 1, position: 'absolute', top: 80, right: 20 }} >
      <Button color="black" title="Sett posisjon" onPress={() => {
        console.log(sheepLocation);
        console.log(props.currentUserLocation);
        if (props.endOfFormFirstFlow) {
          props.finishObservation(props.currentUserLocation, sheepLocation);
        }
        else {
          props.beginObservation(props.currentUserLocation, sheepLocation);
          props.navigation.replace("FormScreen");
        }
      }} />
    </View>

    <View pointerEvents="none" style={{ position: "absolute", justifyContent: "center", alignItems: "center", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Image style={{ width: 100, height: 100, }} source={require("../assets/sniper.png")} />
    </View>

    {props.endOfFormFirstFlow ? null :
      <IconButton featherIconName="corner-down-left" onPress={onFinishTripPress} />
    }
  </>);
}

export default connector(TripMapScreen);
