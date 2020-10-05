import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import { setObservationCoordinates } from "../shared/ActionCreators";
import { Button, Text } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { ActionType } from "../shared/Actions";

// type ExternalMapScreenProps = StackScreenProps<RootStackParamList, "MapScreen">
// type InternalMapScreenProps = ExternalMapScreenProps & {
//   hasSheepPosition: boolean,
//   setObservationCoordinates: (yourCoordinates: Coordinates, sheepCoordinates: Coordinates) => ActionType
// }

const mapStateToProps = (state: SauseeState) => ({
  hasSheepPosition: !!state.trips
    .find(t => t.id === state.currentTripId)?.observations
    .find(o => o.id === state.currentObservationId)?.sheepCoordinates
});

const connector = connect(mapStateToProps, { setObservationCoordinates });

type MapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "MapScreen">

const MapScreen = (props: MapScreenProps) => <>
  <Text>{props.hasSheepPosition ? "Sheep position not yet set" : "Sheep position set"}</Text>
  <Button title="Skip position for now, go to form first" onPress={() => { props.navigation.navigate("FormScreen") }} />
  <Button title="Set sheep position and proceed to form" onPress={() => {
    props.setObservationCoordinates({ lat: 0, lon: 0 }, { lat: 1, lon: 1 });
    console.log("After Set sheep position button press");
  }} />
</>

export default connector(MapScreen);
