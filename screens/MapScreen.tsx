import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import { beginObservation, finishObservation } from "../shared/ActionCreators";
import { Button, Text } from "react-native";
import { connect, ConnectedProps } from "react-redux";


const mapStateToProps = (state: SauseeState) => ({
  /** Flag telling if the map screen is presented at the end of the form-first navigation flow */
  endOfFormFirstFlow: state.currentObservationId && !state.trips
      .find(t => t.id === state.currentTripId)?.observations
      .find(o => o.id === state.currentObservationId)?.sheepCoordinates
});

const connector = connect(mapStateToProps, { beginObservation, finishObservation });

type MapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "MapScreen">

const MapScreen = (props: MapScreenProps) => <>
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
</>

export default connector(MapScreen);
