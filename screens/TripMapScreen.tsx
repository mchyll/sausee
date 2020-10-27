import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState, Coordinates } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation, addRoutePathCoordinates, finishTrip } from "../shared/ActionCreators";
import { Button, View, Image, Alert, Text, Dimensions, Platform } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { TripMapComponent } from "../components/TripMapComponent";
import { IconButton } from "../components/IconButton";
import { isRouteTracking, ROUTE_TRACKER_TASK_NAME, stopRouteTracking } from "../services/BackgroundLocationTracking";
import { FloatingAction } from "react-native-floating-action";
import { MaterialIcons } from '@expo/vector-icons';


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
    endOfFormFirstFlow: !!state.currentObservationId && !state.trips
      .find(t => t.id === state.currentTripId)?.observations
      .find(o => o.id === state.currentObservationId)?.sheepCoordinates,

    currentUserLocation: trip?.routePath[trip?.routePath.length - 1] ?? { latitude: 0, longitude: 0 }
  };
}

const connector = connect(mapStateToProps, { beginObservation, finishObservation, finishTrip });

type TripMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

// todo: initial region
const TripMapScreen = (props: TripMapScreenProps) => {
  const [sheepLocation, setSheepLocation] = useState<Coordinates>({ latitude: 0, longitude: 0 });
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    isRouteTracking().then(setIsTracking)
  }, []);

  const onFinishTripPress = () =>
    Alert.alert("Avslutt oppsynstur", "Er du sikker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "OK", onPress: () => {
          props.finishTrip();
          stopRouteTracking().then(() => props.navigation.replace("DownloadMapScreen"));
        }
      }
    ]);

  const navToFormScreen = () => props.navigation.replace("FormScreen");

  const windowHeight:number = Dimensions.get("window").height;
  const yAxisSniper:number = Platform.OS === "ios" ? windowHeight/20 : windowHeight*102/500;
  const xAxisSniper: number = Platform.OS === "ios" ? 0 : 0;
  return (<>

    <TripMapComponent
      onUserLocationChange={() => { }}
      onSheepLocChangeComplete={region => setSheepLocation({ latitude: region.latitude, longitude: region.longitude })}
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
      <Text>{Platform.OS}</Text>
      <Image style={{ width: 100, height: 100 }} source={require("../assets/sniper.png")} />
    </View>

    <FloatingAction
      floatingIcon={<MaterialIcons name="add-location" size={24} color="black" />}
      onPressMain={() => {
        if (props.endOfFormFirstFlow) {
          props.finishObservation(props.currentUserLocation, sheepLocation);
        }
        else {
          props.beginObservation(props.currentUserLocation, sheepLocation);
          props.navigation.replace("FormScreen");
        }
      }}

    />
  </>);
}

export default connector(TripMapScreen);

// todo: clean up nav flow