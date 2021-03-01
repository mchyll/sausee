import React, { Fragment } from 'react';
import { Marker, Polyline } from "react-native-maps";
import { Observation, FormScreenName, Trip } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, Text } from 'react-native';
import { setCurrentObservation } from "../shared/ActionCreators"



const connector = connect(null, { setCurrentObservation });

type PrevObsPolylinesProps = ConnectedProps<typeof connector> & { navToFormScreen: (formScreenName: FormScreenName) => void, trip?: Trip, current: boolean };

const PrevObsPolylines = (props: PrevObsPolylinesProps) => {
  // console.log("incomming trip in PrevObsPlolylines: ", props.trip);
  // todo: remove null check fall back on loop?
  return (
    <>
      {props.trip && Object.entries(props.trip.observations).map(([id, ob]) => (
        <Fragment key={id}>
          <Polyline
            coordinates={[ob.yourCoordinates, ob.animalCoordinates]}
            strokeWidth={props.current ? 3 : 1}
            zIndex={10}
            strokeColor="rgba(0, 0, 0, 0.5)"
          />
          <Marker
            onPress={() => {
              if (props.current) {
                props.setCurrentObservation(ob.id);
                // Peak code efficiency and readability:
                props.navToFormScreen(({
                  SHEEP: "SheepFormScreen",
                  INJURED_SHEEP: "InjuredSheepFormScreen",
                  DEAD_SHEEP: "DeadSheepFormScreen",
                  PREDATOR: "InjuredSheepFormScreen"
                } as Record<Observation["type"], FormScreenName>)[ob.type]);
              }
            }}
            coordinate={ob.animalCoordinates}
            centerOffset={{ x: 0, y: -34.5 }}
          >
            <View style={{ alignItems: "flex-end" }}>
              <Text>{ob.type === "SHEEP" && ob.sheepCountTotal}</Text>
            </View>
            <Image
              source={getObservationPinSource(ob.type)} // TODO: Change pin based on obs type
              style={{ width: 32, height: 50, resizeMode: "contain", opacity: props.current ? 1 : 0.6 }}
            />
          </Marker>
        </Fragment>
      ))
      }
    </>
  );
}

// todo: better key system

function getObservationPinSource(type: Observation["type"]) {
  switch (type) {
    case "SHEEP": return require("../assets/thinner-pin.png");
    case "INJURED_SHEEP": return require("../assets/injured-sheep-pin.png");
    case "DEAD_SHEEP": return require("../assets/dead-sheep-pin.png");
    case "PREDATOR": return require("../assets/wolf-pin.png");
  }
}

export default connector(PrevObsPolylines);
