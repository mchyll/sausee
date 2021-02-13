import { StackScreenProps, } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import { FlatList } from "react-native-gesture-handler";
import MapView, { UrlTile } from "react-native-maps";
import { connect, ConnectedComponent, ConnectedProps } from "react-redux";
import PrevTripsCards from "../components/PrevTripsCards";
import { RootStackParamList, SauseeState, Trip } from "../shared/TypeDefinitions";
import { MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { beginObservation, finishObservation, finishTrip, setPreviousTripOverlayIndex } from "../shared/ActionCreators";
import { RoutePolyline } from "../components/RoutePolyline";
import PrevObsPolylines from "../components/PrevObsPolylines";


const mapStateToProps = (state: SauseeState) => ({
  currentTripOverlayIndex: state.currentTripOverlayIndex,
  currentTrip: state.trips.find(trip => state.currentTripId === trip.id),
  //trips: state.trips,
});

const connector = connect(mapStateToProps, { setPreviousTripOverlayIndex });

type TripsListScreenProps = ConnectedProps<typeof connector>
  & StackScreenProps<RootStackParamList, "OldTripScreen">;

const OldTripScreen = (props: TripsListScreenProps) => {
  // card not showing overlay
  // current trip is set without ending it when leaving screen
  //const trips = props.trips;
  const [isShowingCards, setIsShowingCards] = useState(false);
  const [beforePreviousTripIndex, setBeforePreviousTripIndex] = useState(-1);

  const systemBlue = "#007AFF";

  return (
    <>
      <MapView
        maxZoomLevel={20}
        pitchEnabled={false}
        provider="google"
        style={StyleSheet.absoluteFill}
        showsUserLocation={true}
        //showsMyLocationButton={true}
        initialRegion={props.currentTrip?.mapRegion}
      >
      <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />
      <RoutePolyline routePath={props.currentTrip?.routePath} current={true} />
      <PrevObsPolylines trip={props.currentTrip} navToFormScreen={() => {}} current={true} />

      </MapView>

      {isShowingCards && <PrevTripsCards hideThisComponent={() => setIsShowingCards(false)} setPreviousTripIndex={props.setPreviousTripOverlayIndex} />}
      <View style={{ ...StyleSheet.absoluteFillObject, bottom: 240 }} pointerEvents="box-none">
        <FloatingAction
          color={"white"}
          showBackground={false}
          visible={isShowingCards}
          floatingIcon={<MaterialIcons name="layers-clear" size={24} color="black" />}
          onPressMain={() => {
            props.setPreviousTripOverlayIndex(-1);
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
            props.setPreviousTripOverlayIndex(beforePreviousTripIndex);
            setBeforePreviousTripIndex(-1);

            setIsShowingCards(false);
          }}
        />
      </View>
      <View style={{ ...StyleSheet.absoluteFillObject, /*bottom: 80*/ }} pointerEvents="box-none">
        <FloatingAction
          color="white"
          showBackground={false}
          visible={!isShowingCards}
          floatingIcon={<MaterialCommunityIcons name="layers-outline" size={24} color="black" />}
          onPressMain={() => {
            setBeforePreviousTripIndex(props.currentTripOverlayIndex);
            props.setPreviousTripOverlayIndex(0);
            setIsShowingCards(true);
          }}
        />
      </View>
    </>);
}

export default connector(OldTripScreen);
