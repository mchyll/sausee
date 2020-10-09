import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState, Coordinates } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation } from "../shared/ActionCreators";
import { Button, Text, View, Image } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { TripMapComponent } from "../components/MapComponent";
import { Region } from "react-native-maps";


const mapStateToProps = (state: SauseeState) => ({
  /** Flag telling if the map screen is presented at the end of the form-first navigation flow */
  endOfFormFirstFlow: !!state.currentObservationId && !state.trips
    .find(t => t.id === state.currentTripId)?.observations
    .find(o => o.id === state.currentObservationId)?.sheepCoordinates
});

const connector = connect(mapStateToProps, { beginObservation, finishObservation });

type TripMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

// todo: initial region
const TripMapScreen = (props: TripMapScreenProps) => {
  let sheepLocation: Coordinates;
  let userLocation: Coordinates;
  return (<>
    <TripMapComponent
      onUserLocationChange={(locEvent) => userLocation = { lat: locEvent.nativeEvent.coordinate.latitude, lon: locEvent.nativeEvent.coordinate.longitude }}
      onSheepLocChangeComplete={(region) => (sheepLocation = {lat: region.latitude, lon: region.longitude})}
    />
    <View style={{ backgroundColor: "red", borderWidth: 1, position: 'absolute', top: 80, left: 20, alignSelf: 'flex-start', }} >
      <Button title="Location later" color="black" onPress={() => {
        props.beginObservation();
        props.navigation.navigate("FormScreen");
      }} />
    </View>
    <View style={{ backgroundColor: "green", borderWidth: 1, position: 'absolute', top: 80, right: 20, alignSelf: 'flex-start', }} >
      <Button color="black" title="Set position" onPress={() => {
        console.log(sheepLocation);
        console.log(userLocation);
        const lat = Math.random() * 180, lon = lat;
        props.beginObservation(userLocation, sheepLocation);
        props.navigation.replace("FormScreen");
      }} />
    </View>
    <View pointerEvents="none" style={{ position: "absolute", top: 370, left: 135 }}>
      <Image style={{ width: 100, height: 100, }} source={require("../assets/sniper.png")} />
    </View>
  </>);
}

export default connector(TripMapScreen);

/*
<Text>{props.endOfFormFirstFlow ? "End of form-first flow: Returned from form, now you must select sheep position" : "No current observation"}</Text>
  {props.endOfFormFirstFlow ?
    <Button title="Just DOIT" onPress={() => {
      const lat = Math.random() * 180, lon = lat;
      props.finishObservation({ lat, lon }, { lat, lon });
    }} /> :
    <>
      <Button title="Form-first flow: Skip position for now, go directly to form" onPress={() => {
        props.beginObservation();
        props.navigation.navigate("FormScreen");
      }} />
      <Button title="Map-first flow: Set sheep position and proceed to form" onPress={() => {
        const lat = Math.random() * 180, lon = lat;
        props.beginObservation({ lat, lon }, { lat, lon });
        props.navigation.navigate("FormScreen");
      }} />
    </>
  }
*/

// get location of the middle of the screen