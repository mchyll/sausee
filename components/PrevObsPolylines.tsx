import React from 'react';
import { Polyline } from "react-native-maps";
import { SauseeState } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";

const mapStateToProps = (state: SauseeState) => ({
  trip: state.trips.find(trip => state.currentTripId === trip.id),
});

const connector = connect(mapStateToProps);

type PrevObsPolylinesProps = ConnectedProps<typeof connector>;

const PrevObsPolylines = (props: PrevObsPolylinesProps) => (
  <>
    {props.trip?.observations.map((ob, i) => ob.yourCoordinates && ob.sheepCoordinates ? <Polyline
      key={i}
      coordinates={[ob.yourCoordinates, ob.sheepCoordinates]}
      strokeWidth={4}
      strokeColor="black"
      lineDashPattern={[10, 20]}
    /> : null)}
  </>
)


export default connector(PrevObsPolylines);