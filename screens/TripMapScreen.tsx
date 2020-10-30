import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState, Coordinates } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation, addRoutePathCoordinates, finishTrip } from "../shared/ActionCreators";
import { Button, View, Image, Alert, Text, Dimensions, Platform } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { IconButton } from "../components/IconButton";
import { FloatingAction } from "react-native-floating-action";
import { MaterialIcons } from '@expo/vector-icons';
import PrevTripsCards from "../components/PrevTripsCards";
import { Region } from "react-native-maps";
import TripMapComponent from "../components/TripMapComponent";


const mapStateToProps = (state: SauseeState) => {
  const trip = state.trips.find((trip) => trip.id === state.currentTripId);
  // todo: looks like there is an infinite loop with adding route path coordinates
  //console.log("id:" + trip?.id);
  // console.log("observations:" + trip?.observations);
  //console.log("timestamp:" + trip?.timestamp);
  //console.log("Trip path: " + trip?.routePath);
  // if (!trip?.observations) console.log("NO STUFFS!")

  return {
    /** Flag telling if the map screen is presented at the end of the form-first navigation flow */

    // simplyfing nav flow
    //endOfFormFirstFlow: !state.currentObservation?.sheepCoordinates, 

    currentUserLocation: trip?.routePath[trip?.routePath.length - 1] ?? { latitude: 0, longitude: 0 },
    trips: state.trips,
  };
}

const connector = connect(mapStateToProps, { beginObservation, finishObservation, finishTrip });

type TripMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

// todo: initial region
const TripMapScreen = (props: TripMapScreenProps) => {
  const [sheepLocation, setSheepLocation] = useState<Coordinates>({ latitude: 0, longitude: 0 });
  const [isTracking, setIsTracking] = useState(false);
  const [isShowingCards, setIsShowingCards] = useState(false);

  const navToFormScreen = () => props.navigation.replace("FormScreen");

  const windowHeight: number = Dimensions.get("window").height;
  const yAxisSniper: number = Platform.OS === "ios" ? windowHeight / 20 : windowHeight * 102 / 500;
  const xAxisSniper: number = Platform.OS === "ios" ? 0 : 0;
  // only works on Truls's iPhone and Magnus's android. 
  // todo: find a solution that works for all screens
  return (<>

    <TripMapComponent
      onUserLocationChange={() => { }}
      onSheepLocChangeComplete={(region: Region) => setSheepLocation({ latitude: region.latitude, longitude: region.longitude })}
      sheepLocation={sheepLocation}
      currentUserLocation={props.currentUserLocation}
      navToFormScreen={navToFormScreen}
    />



    {/*<Text style={{ position: "absolute", bottom: 10, right: 10 }}>{isTracking ? "Tracking" : "Not tracking"}</Text>*/}

    {/*props.endOfFormFirstFlow ? null :
      <View style={{ backgroundColor: "red", borderWidth: 1, position: 'absolute', top: 80, left: 20 }} >
        <Button title="Posisjon senere" color="black" onPress={() => {
          props.beginObservation();
          props.navigation.replace("FormScreen");
        }} />
      </View>
      */}
    <View pointerEvents={"none"} style={{ position: "absolute", justifyContent: "center", alignItems: "center", top: yAxisSniper, left: xAxisSniper, right: 0, bottom: 0 }}>
      <Image style={{ width: 100, height: 100 }} source={require("../assets/sniper.png")} />
    </View>

    {isShowingCards && <PrevTripsCards />}

    <View style={{ top: -200 }}>
      <FloatingAction

        floatingIcon={<MaterialIcons name="add-location" size={24} color="black" />}
        onPressMain={() => {
          setIsShowingCards(!isShowingCards);
        }}
      />
    </View>
    <FloatingAction
      visible={!isShowingCards}
      floatingIcon={<MaterialIcons name="add-location" size={24} color="black" />}
      onPressMain={() => {
        props.beginObservation(props.currentUserLocation, sheepLocation);
        props.navigation.replace("FormScreen");


      }}
    />


  </>);
}

export default connector(TripMapScreen);

// todo: clean up nav flow