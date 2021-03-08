import { StackScreenProps, } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { FloatingAction } from "react-native-floating-action";
import MapView, { UrlTile } from "react-native-maps";
import { connect, ConnectedProps } from "react-redux";
import PrevTripsCards from "../components/PrevTripsCards";
import { FormScreenParamList, RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import { MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { setTripOverlayIndex } from "../shared/ActionCreators";
import { RoutePolyline } from "../components/RoutePolyline";
import PrevObsPolylines from "../components/PrevObsPolylines";
import { tileTemplateWithPath } from "../services/MapDownload";
import { MAX_ZOOM } from "../shared/constants";


const mapStateToProps = (state: SauseeState) => {
  const trips = state.trips.filter((value, index, array) => (value.id !== state.currentTripId));
  return {
    tripOverlayIndex: state.tripOverlayIndex,
    currentTrip: state.trips.find(trip => state.currentTripId === trip.id),
    trips,
    isUsingLocalTiles: state.isUsingLocalTiles,
  }
};

const connector = connect(mapStateToProps, { setTripOverlayIndex });

type TripsListScreenProps = ConnectedProps<typeof connector>
  & StackScreenProps<RootStackParamList, "OldTripScreen">;

const OldTripScreen = (props: TripsListScreenProps) => {
  // card not showing overlay
  //const trips = props.trips;
  const [isShowingCards, setIsShowingCards] = useState(false);
  const [beforeTripOverlayIndex, setBeforeTripOverlayIndex] = useState(-1);

  const systemBlue = "#007AFF";
  const previousTrip = props.trips[props.tripOverlayIndex]; // todo add checks
  
  const navigateToFormScreen = (formScreenName: keyof FormScreenParamList) => {
    if (Platform.OS === "ios") {
      props.navigation.navigate("FormScreenModals", { screen: formScreenName });
    }
    else {
      props.navigation.navigate(formScreenName);
    }
  }

  return (
    <>
      <MapView
        key={props.isUsingLocalTiles.toString()}
        maxZoomLevel={MAX_ZOOM}
        pitchEnabled={false}
        provider="google"
        style={StyleSheet.absoluteFill}
        showsUserLocation={true}
        //showsMyLocationButton={true}
        initialRegion={props.currentTrip?.mapRegion}
      >
        {<UrlTile urlTemplate={props.isUsingLocalTiles
          ? tileTemplateWithPath
          : "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}"} />
        }
        <RoutePolyline routePath={props.currentTrip?.routePath} current={true} />
        <PrevObsPolylines trip={props.currentTrip} navToFormScreen={navigateToFormScreen} current={true} />

        {previousTrip && <>
          <RoutePolyline routePath={previousTrip.routePath} current={false} />
          <PrevObsPolylines trip={previousTrip} navToFormScreen={navigateToFormScreen} current={false} />
        </>}

      </MapView>

      {isShowingCards && <PrevTripsCards hideThisComponent={() => setIsShowingCards(false)} />}
      <View style={{ ...StyleSheet.absoluteFillObject, bottom: 240 }} pointerEvents="box-none">
        <FloatingAction
          color={"white"}
          showBackground={false}
          visible={isShowingCards}
          floatingIcon={<MaterialIcons name="layers-clear" size={24} color="black" />}
          onPressMain={() => {
            props.setTripOverlayIndex(-1);
            setIsShowingCards(false);

            setBeforeTripOverlayIndex(-1);

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
            props.setTripOverlayIndex(beforeTripOverlayIndex);
            setBeforeTripOverlayIndex(-1);

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
            setBeforeTripOverlayIndex(props.tripOverlayIndex);
            props.setTripOverlayIndex(0);
            setIsShowingCards(true);
          }}
        />
      </View>
    </>);
}

export default connector(OldTripScreen);
