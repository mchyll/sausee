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
      {props.trip && Object.entries(props.trip.observations).map(([id, ob]) => {
        let formScreenDestination: FormScreenName;
        let pinImage;
        switch (ob.type) { // schedig
          case "INJURED_SHEEP":
            formScreenDestination = "InjuredSheepFormScreen";
            pinImage = require("../assets/injured-sheep-pin.png");
            break;
          case "DEAD_SHEEP":
            formScreenDestination = "InjuredSheepFormScreen";
            pinImage = require("../assets/dead-sheep-pin.png");
            break;
          case "PREDATOR":
            formScreenDestination = "PredatorFormScreen";
            pinImage = require("../assets/wolf-pin.png");
            break;
          case "SHEEP":
          default:
            formScreenDestination = "SheepFormScreen";
            pinImage = require("../assets/thinner-pin.png");
            break;
        }
        return (
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
                  props.navToFormScreen(formScreenDestination);
                }
              }}
              coordinate={ob.animalCoordinates}
              centerOffset={{ x: 0, y: -34.5 }}
            >
              <View style={{ alignItems: "flex-end" }}>
                <Text>{ob.type === "SHEEP" && ob.sheepCountTotal}</Text>
              </View>
              <Image
                source={pinImage}
                style={{ width: 32, height: 50, resizeMode: "contain", opacity: props.current ? 1 : 0.6 }}
              />
            </Marker>
          </Fragment>
        )
      })
      }
    </>
  );
}

// todo: better key system

export default connector(PrevObsPolylines);
