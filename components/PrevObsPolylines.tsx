import React, { Fragment } from 'react';
import { Callout, Marker, Polyline } from "react-native-maps";
import { Trip } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, Text } from 'react-native';
import { setCurrentObservation } from "../shared/ActionCreators"



const connector = connect(null, { setCurrentObservation });

type PrevObsPolylinesProps = ConnectedProps<typeof connector> & { navToFormScreen: () => void, trip: Trip, current: boolean };

const PrevObsPolylines = (props: PrevObsPolylinesProps) => {
  // console.log("incomming trip in PrevObsPlolylines: ", props.trip);
  // todo: remove null check fall back on loop?
  return (
    <>
      {Object.entries(props.trip.observations).map(([id, ob]) => ob.yourCoordinates && ob.sheepCoordinates
        ? <Fragment key={id}>
          <Polyline
            coordinates={[ob.yourCoordinates, ob.sheepCoordinates]}
            strokeWidth={2}
            strokeColor={props.current ? "black" : "grey"} // todo: is the difference big enough for color blind people?
            lineDashPattern={[10, 10]}
          />
          <Callout onPress={() => {
            console.log("press callout")
            props.setCurrentObservation(ob.id);
            props.navToFormScreen();
          }}
          >
            <Marker
              coordinate={ob.sheepCoordinates}

            >

              <View style={{top:-32}}>
                <View style={{ alignItems: "flex-end", }}>
                  <Text >{ob.sheepCountTotal}</Text>
                </View>
                <Image
                  source={require("../assets/thinner-pin.png")}
                  style={props.current ? { width: 30, height: 50, opacity: 1 } : { width: 30, height: 50, opacity: 0.80 }}

                />
              </View>

            </Marker>
          </Callout>
        </Fragment>
        : null)}
    </>
  );
}
// todo: better key system

export default connector(PrevObsPolylines);
