import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import { beginObservation, setCoordinatesAndFinishObservation } from "../shared/ActionCreators";
import { Button, Text } from "react-native";
import { connect, ConnectedProps } from "react-redux";


const mapStateToProps = (state: SauseeState) => ({
  selectSheepPosAfterForm: !!state.currentObservationId
});

const connector = connect(mapStateToProps, { beginObservation, setCoordinatesAndFinishObservation });

type MapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "MapScreen">

const MapScreen = (props: MapScreenProps) => <>
  <Text>{props.selectSheepPosAfterForm ? "Returned from form, now you must select sheep position" : "No current observation"}</Text>
  {props.selectSheepPosAfterForm ?
    <Button title="Just DOIT" onPress={() => {
      const lat = Math.random() * 180, lon = lat;
      props.setCoordinatesAndFinishObservation({ lat, lon }, { lat, lon });
    }} /> :
    <>
      <Button title="Skip position for now, go to form first" onPress={() => {
        props.beginObservation();
        props.navigation.navigate("FormScreen");
      }} />
      <Button title="Set sheep position and proceed to form" onPress={() => {
        const lat = Math.random() * 180, lon = lat;
        props.beginObservation({ lat, lon }, { lat, lon });
        props.navigation.navigate("FormScreen");
      }} />
    </>
  }
</>

export default connector(MapScreen);
