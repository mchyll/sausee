import React, { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState, Coordinates, FormScreenParamList } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation, finishTrip, setTripOverlayIndex } from "../shared/ActionCreators";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, StyleSheet, Text, Platform } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import PrevTripsCards from "../components/PrevTripsCards";
import TripMapComponent from "../components/TripMapComponent";
import { foregroundTracker } from "../services/LocationTracking";
import { FAB } from 'react-native-paper';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ObservationTypeDescriptions } from "../shared/Descriptions";
import { AddLocationIcon, DeadSheepIcon, InjuredSheepIcon, MultipleSheepIcon, PredatorIcon } from "../components/ObservationIcons";
import { isIphoneX } from 'react-native-iphone-x-helper'


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
    tripOverlayIndex: state.tripOverlayIndex
  };
}

const connector = connect(mapStateToProps, { beginObservation, finishObservation, finishTrip, setTripOverlayIndex });

type TripMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

const TripMapScreen = (props: TripMapScreenProps) => {
  const [sheepLocation, setSheepLocation] = useState<Coordinates>({ latitude: 0, longitude: 0 });
  const [isShowingCards, setIsShowingCards] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const [beforePreviousTripIndex, setBeforePreviousTripIndex] = useState(-1);

  const systemBlue = "#007AFF";

  const navigateToFormScreen = (formScreenName: keyof FormScreenParamList) => {
    if (Platform.OS === "ios") {
      props.navigation.navigate("FormScreenModals", { screen: formScreenName });
    }
    else {
      props.navigation.navigate(formScreenName);
    }
  }

  const fabGroupFabStyle = isIphoneX() ? { backgroundColor: systemBlue, marginBottom: 0 } : {backgroundColor: systemBlue};


  return (<>

    <TripMapComponent
      onSheepLocationChangeComplete={region => setSheepLocation({ latitude: region.latitude, longitude: region.longitude })}
      onUserLocationChange={e => foregroundTracker(e.nativeEvent.coordinate)}
      sheepLocation={sheepLocation}
      currentUserLocation={props.currentUserLocation}
      navToFormScreen={navigateToFormScreen}
      oldTripIndex={props.tripOverlayIndex}

    />

    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}>
      <Image style={{ height: 100, width: 80, resizeMode: "contain", top: -50 }} source={require("../assets/thinner-pin.png")} />
    </View>

    
    {isShowingCards && <PrevTripsCards hideThisComponent={() => setIsShowingCards(false)} />}
    <View style={{ ...StyleSheet.absoluteFillObject, bottom: 240 }} pointerEvents="box-none">
      <FloatingAction
        color={"white"}
        showBackground={false}
        visible={isShowingCards}
        floatingIcon={<MaterialIcons name="layers-clear" size={24} color="black" />}
        onPressMain={() => {
          props.setTripOverlayIndex(-1);
          setBeforePreviousTripIndex(-1);

          setIsShowingCards(false);
        }}
      />
    </View>
    <View style={{ ...StyleSheet.absoluteFillObject, bottom: 160 }} pointerEvents="box-none">
      <FloatingAction
        color={systemBlue}
        showBackground={false}
        visible={isShowingCards}
        floatingIcon={<Entypo name="cross" size={24} color="black" />}
        onPressMain={() => {
          props.setTripOverlayIndex(beforePreviousTripIndex);
          setBeforePreviousTripIndex(-1);

          setIsShowingCards(false);
        }}
      />
    </View>
    <View style={{ ...StyleSheet.absoluteFillObject, bottom: 80 }} pointerEvents="box-none">
      <FloatingAction
        color="white"
        showBackground={false}
        visible={!isShowingCards && !fabOpen}
        floatingIcon={<MaterialCommunityIcons name="layers-outline" size={24} color="black" />}
        onPressMain={() => {
          setBeforePreviousTripIndex(props.tripOverlayIndex);
          props.setTripOverlayIndex(0);
          setIsShowingCards(true);
        }}
      />
    </View>

    <FAB.Group
      visible={!isShowingCards}
      open={fabOpen}
      onStateChange={state => setFabOpen(state.open)}
      style={{ paddingBottom: 14, paddingRight: 14 }}
      fabStyle={fabGroupFabStyle}
      icon={fabOpen ? AddSheepIcon : AddLocationIcon}
      onPress={() => {
        if (fabOpen) {
          props.beginObservation("SHEEP", props.currentUserLocation, sheepLocation);
          navigateToFormScreen("SheepFormScreen");
        }
      }}
      actions={[
        {
          icon: PredatorIcon,
          label: ObservationTypeDescriptions["PREDATOR"],
          onPress: () => {
            props.beginObservation("PREDATOR", props.currentUserLocation, sheepLocation);
            navigateToFormScreen("PredatorFormScreen");
          }
        },
        {
          icon: DeadSheepIcon,
          label: ObservationTypeDescriptions["DEAD_SHEEP"],
          onPress: () => {
            props.beginObservation("DEAD_SHEEP", props.currentUserLocation, sheepLocation);
            navigateToFormScreen("DeadSheepFormScreen");
          }
        },
        {
          icon: InjuredSheepIcon,
          label: ObservationTypeDescriptions["INJURED_SHEEP"],
          onPress: () => {
            props.beginObservation("INJURED_SHEEP", props.currentUserLocation, sheepLocation);
            navigateToFormScreen("InjuredSheepFormScreen");
          }
        }
      ]}
    />

    {/* Label for main action when FAB speed dial is open. Styling taken from FAB.Group source code */}
    {fabOpen && <View style={{
      position: "absolute",
      bottom: 43,
      right: 95,
      backgroundColor: "white",
      borderRadius: 5,
      paddingHorizontal: 12,
      paddingVertical: 6,
      elevation: 2,
    }}>
      <TouchableWithoutFeedback onPress={() => {
        setFabOpen(false);
        props.beginObservation("SHEEP", props.currentUserLocation, sheepLocation);
        navigateToFormScreen("SheepFormScreen");
      }}>
        <Text style={{ color: "rgba(0, 0, 0, 0.46)" }}>
          {ObservationTypeDescriptions["SHEEP"]}
        </Text>
      </TouchableWithoutFeedback>
    </View>}

  </>);
}

const AddSheepIcon = ({ size }: { size: number }) =>
  <MultipleSheepIcon size={size} style={{ width: size + 10, height: size + 10, top: -5, left: -5 }} />

export default connector(TripMapScreen);