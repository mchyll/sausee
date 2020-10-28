import React, { Fragment } from 'react';
import { Callout, Marker, Polyline } from "react-native-maps";
import { SauseeState } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, Text, Pressable } from 'react-native';
import { setCurrentObservation } from "../shared/ActionCreators"

const mapStateToProps = (state: SauseeState) => ({
  trip: state.trips.find(trip => state.currentTripId === trip.id),
});

const connector = connect(mapStateToProps, { setCurrentObservation });

type PrevObsPolylinesProps = ConnectedProps<typeof connector> & { navToFormScreen: () => void };

const PrevObsPolylines = (props: PrevObsPolylinesProps) => (
  <>
    {Object.entries(props.trip?.observations ?? {}).map(([id, ob]) => ob.yourCoordinates && ob.sheepCoordinates
      ? <Fragment key={id}>
        <Polyline
          coordinates={[ob.yourCoordinates, ob.sheepCoordinates]}
          strokeWidth={2}
          strokeColor="black"
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

            <>
              <View style={{ alignItems: "flex-end" }}>
                <Text >{ob.sheepCountTotal}</Text></View>
              <Image
                source={require("../assets/sheep_1.png")}
                style={{ width: 30, height: 30, opacity: 1 }}

              />
            </>

          </Marker>
        </Callout>
      </Fragment>
      : null)}
  </>
)
// todo: better key system

export default connector(PrevObsPolylines);
