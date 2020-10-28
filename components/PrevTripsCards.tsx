import React, { Fragment } from 'react';
import { Callout, Marker, Polyline } from "react-native-maps";
import { SauseeState } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, Text, Pressable } from 'react-native';
import { setCurrentObservationID } from "../shared/ActionCreators"

const mapStateToProps = (state: SauseeState) => ({
  trips: state.trips,
});

const connector = connect(mapStateToProps);//, { setCurrentObservationID });

type PrevTripsCardsProps = ConnectedProps<typeof connector>; // & { navToFormScreen: () => void };

const PrevTripsCards = (props: PrevTripsCardsProps) => (
  // Set region to preview when a card is previewed
  // Set region back to origial when leaving card view. Maybe not this componets reponsibility.
  // Use trips as they are stored in redux. Last trip first.
  <>
    
  </>
);

export default connector(PrevTripsCards);
