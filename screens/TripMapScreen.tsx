import React, { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState, Coordinates } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation, finishTrip, setPreviousTripOverlayIndex } from "../shared/ActionCreators";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, Dimensions, Platform } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
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
    currentUserLocation: trip?.routePath[trip?.routePath.length - 1] ?? { latitude: 0, longitude: 0 },
    trips: state.trips,
    currentTrip: state.trips.find(trip => state.currentTripId === trip.id),
    state,
  };
}

const connector = connect(mapStateToProps, { beginObservation, finishObservation, finishTrip, setPreviousTripOverlayIndex });

type TripMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

// todo: initial region
const TripMapScreen = (props: TripMapScreenProps) => {
  const [sheepLocation, setSheepLocation] = useState<Coordinates>({ latitude: 0, longitude: 0 });
  const [isShowingCards, setIsShowingCards] = useState(false);

  const navToFormScreen = () => props.navigation.navigate("FormScreen");

  // only works on Truls's iPhone and Magnus's android. 
  // todo: find a solution that works for all screens
  // The problem maybe that the polyline's ending in not accurat, so that putting the cross in the middle actually is the correct thing to do
  const windowHeight: number = Dimensions.get("window").height;
  const yAxisSniper: number = Platform.OS === "ios" ? windowHeight / 20 : windowHeight * 102 / 500;
  const xAxisSniper: number = Platform.OS === "ios" ? 0 : 0;

  const setPreviousTripIndexFunction = (index: number) => {
    props.setPreviousTripOverlayIndex(index);
  }

  const [beforePreviousTripIndex, setBeforePreviousTripIndex] = useState(-1);


  return (<>

    <TripMapComponent
      onUserLocationChange={() => { }}
      onSheepLocChangeComplete={(region: Region) => setSheepLocation({ latitude: region.latitude, longitude: region.longitude })}
      sheepLocation={sheepLocation}
      currentUserLocation={props.currentUserLocation}
      navToFormScreen={navToFormScreen}
      oldTripIndex={props.state.currentTripOverlayIndex}
    />



    {/*<Text style={{ position: "absolute", bottom: 10, right: 10 }}>{isTracking ? "Tracking" : "Not tracking"}</Text>*/}

    {/*props.endOfFormFirstFlow ? null :
      <View style={{ backgroundColor: "red", borderWidth: 1, position: 'absolute', top: 80, left: 20 }} >
        <Button title="Posisjon senere" color="black" onPress={() => {
          props.beginObservation();
          props.navigation.navigate("FormScreen");
        }} />
      </View>
      */}
    <View pointerEvents={"none"} style={{ position: "absolute", justifyContent: "center", alignItems: "center", top: yAxisSniper, left: xAxisSniper, right: 0, bottom: 0 }}>
      <Image style={{ width: 100, height: 100 }} source={require("../assets/sniper.png")} />
    </View>

    {isShowingCards && <PrevTripsCards hideThisComponent={() => setIsShowingCards(false)} setPreviousTripIndex={setPreviousTripIndexFunction} />}
    <View style={{ top: -325 }}>
      <FloatingAction
        showBackground={false}
        visible={isShowingCards}
        floatingIcon={isShowingCards ? <MaterialIcons name="layers-clear" size={24} color="black" /> : <MaterialCommunityIcons name="layers-outline" size={24} color="black" />}
        onPressMain={() => {
          setIsShowingCards(!isShowingCards);
          if (isShowingCards) {
            props.setPreviousTripOverlayIndex(-1);
            setBeforePreviousTripIndex(-1);
          } else {
            setBeforePreviousTripIndex(props.state.currentTripOverlayIndex);
            props.setPreviousTripOverlayIndex(0);
          }
        }}
      />
    </View>
    <View style={{ top: -250 }}>
      <FloatingAction
        showBackground={false}
        visible={isShowingCards}
        floatingIcon={isShowingCards ? <Entypo name="cross" size={24} color="black" /> : <MaterialCommunityIcons name="layers-outline" size={24} color="black" />}
        onPressMain={() => {
          setIsShowingCards(!isShowingCards);
          if (isShowingCards) {
            props.setPreviousTripOverlayIndex(beforePreviousTripIndex);
            setBeforePreviousTripIndex(-1);
          } else {
            setBeforePreviousTripIndex(props.state.currentTripOverlayIndex);
            props.setPreviousTripOverlayIndex(0);
          }
        }}
      />
    </View>
    <View style={{ top: -160 }}>
      <FloatingAction
        showBackground={false}
        visible={!isShowingCards}
        floatingIcon={isShowingCards ? <Entypo name="cross" size={24} color="black" /> : <MaterialCommunityIcons name="layers-outline" size={24} color="black" />}
        onPressMain={() => {
          setIsShowingCards(!isShowingCards);
          if (isShowingCards) {
            props.setPreviousTripOverlayIndex(beforePreviousTripIndex);
            setBeforePreviousTripIndex(-1);
          } else {
            setBeforePreviousTripIndex(props.state.currentTripOverlayIndex);
            props.setPreviousTripOverlayIndex(0);
          }
        }}
      />
    </View>
    <FloatingAction
      showBackground={false}
      visible={!isShowingCards}
      floatingIcon={<MaterialIcons name="add-location" size={24} color="black" />}
      onPressMain={() => {
        props.beginObservation(props.currentUserLocation, sheepLocation);
        props.navigation.navigate("NewFormScreen", { initialNearForm: false });
        /*if (props.endOfFormFirstFlow) {
          props.finishObservation(props.currentUserLocation, sheepLocation);
        }
        else {
          props.beginObservation(props.currentUserLocation, sheepLocation);
          props.navigation.replace("FormScreen");
        }*/
      }}

    />


  </>);
}

// the if statements in th the floating action buttons are redundant as only one of the cases always will fire.
// They are there so that is is more modular during testing. Will be removed when a design is settled after user testing.

export default connector(TripMapScreen);

// todo: clean up nav flow