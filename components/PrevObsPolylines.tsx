import React, { Fragment } from 'react';
import { Callout, Marker, Polyline } from "react-native-maps";
import { Trip } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, Text } from 'react-native';
import { setCurrentObservation } from "../shared/ActionCreators"



const connector = connect(null, { setCurrentObservation });

type PrevObsPolylinesProps = ConnectedProps<typeof connector> & { navToFormScreen: () => void, trip?: Trip, current: boolean };

const PrevObsPolylines = (props: PrevObsPolylinesProps) => {
  // console.log("incomming trip in PrevObsPlolylines: ", props.trip);
  // todo: remove null check fall back on loop?
  return (
    <>
      {props.trip && Object.entries(props.trip.observations).map(([id, ob]) => ob.yourCoordinates && ob.sheepCoordinates
        ? <Fragment key={id}>
          <Polyline
            coordinates={[ob.yourCoordinates, ob.sheepCoordinates]}
            strokeWidth={props.current ? 3 : 1}
            zIndex={10}
            strokeColor="rgba(0, 0, 0, 0.5)"
          />
          <Callout onPress={() => {
            if(props.current) {
              props.setCurrentObservation(ob.id);
              props.navToFormScreen();
            }
          }}>
            <Marker coordinate={ob.sheepCoordinates} centerOffset={{ x: 0, y: -34.5 }}>
              <View style={{ alignItems: "flex-end" }}>
                <Text>{ob.sheepCountTotal}</Text>
              </View>
              <Image
                source={require("../assets/thinner-pin.png")}
                style={{ width: 32, height: 50, resizeMode: "contain", opacity: props.current ? 1 : 0.6 }}
              />
            </Marker>
          </Callout>
        </Fragment>
        : null)}
    </>
  );
}

// todo: better key system

export default connector(PrevObsPolylines);
