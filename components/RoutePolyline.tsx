import React from 'react';
import { Polyline } from "react-native-maps";
import { SauseeState } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";

const mapStateToProps = (state: SauseeState) => ({
  routePath: state.trips.find(trip => state.currentTripId === trip.id)?.routePath,
});

const connector = connect(mapStateToProps);

type RoutePolylineProps = ConnectedProps<typeof connector>;

const RoutePolyline = (props: RoutePolylineProps) => (
  <>
    <Polyline
      coordinates={props.routePath ?? []}
      strokeColor="#000"
      strokeWidth={6}
      zIndex={100}
    />
  </>
)

export default connector(RoutePolyline);