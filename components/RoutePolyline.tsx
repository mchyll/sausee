import React from 'react';
import { Polyline } from "react-native-maps";
import { SauseeState, Coordinates } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";

type RoutePolylineProps = {
  routePath?: Coordinates[],
  current: boolean,
};

export const RoutePolyline = (props: RoutePolylineProps) => (
  <>
    <Polyline
      coordinates={props.routePath ?? []}
      strokeColor={props.current ? "#000": "#888"}
      strokeWidth={6}
      zIndex={100}
    />
  </>
)

