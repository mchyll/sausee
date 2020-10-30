//import { LocationData } from "expo-location";
import React from "react";
import { StyleSheet, Dimensions, View, Image } from "react-native";
import MapView, { EventUserLocation, Marker, Polyline, Region, UrlTile } from "react-native-maps";
import { connect, ConnectedProps } from "react-redux";
import { Coordinates, Observation, SauseeState } from "../shared/TypeDefinitions";
import PrevObsPolylines from "./PrevObsPolylines";
import PrevTripsCards from "./PrevTripsCards";
import { RoutePolyline } from "./RoutePolyline";

// trip: state.trips.find(trip => state.currentTripId === trip.id),
/*
const mapStateToProps = (state: SauseeState) => ({
  trip: state.trips.find(trip => state.currentTripId === trip.id),
});

const connector = connect(mapStateToProps, { setCurrentObservationID });

type PrevObsPolylinesProps = ConnectedProps<typeof connector> & { navToFormScreen: () => void };

*/

const mapStateToProps = (state: SauseeState) => ({
    state,
    trip: state.trips.find(trip => state.currentTripId === trip.id),
});

const connector = connect(mapStateToProps);

type TripMapComponentProps = ConnectedProps<typeof connector> & {
    onSheepLocChangeComplete: (region: Region) => void;
    onUserLocationChange: (region: EventUserLocation) => void;
    sheepLocation: Coordinates;
    currentUserLocation: Coordinates;
    navToFormScreen: () => void;
}

const TripMapComponent = (props: TripMapComponentProps) => {
    return <>
        <MapView
            mapType="none"
            style={styles.mapStyle}
            showsUserLocation={true}
            // showsMyLocationButton={true}
            // showsCompass={true}
            onRegionChange={props.onSheepLocChangeComplete}
            onUserLocationChange={props.onUserLocationChange}
        >

            <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />
            {/* <UrlTile urlTemplate={(FileSystem.documentDirectory ?? "") + "z{z}_x{x}_y{y}.png"} /> */}
            {/* <LocalTile pathTemplate={"${RNFS.DocumentDirectoryPath}/z{z}_x{x}_y{y}.png"} tileSize={256} /> */}

            <Polyline // preview line
                coordinates={[props.sheepLocation, props.currentUserLocation]}
                strokeColor="black"
                strokeWidth={2}
                lineDashPattern={[10, 10]}
            />

            <RoutePolyline routePath={props.trip?.routePath} current={true} />
            <PrevObsPolylines trip={props.trip} navToFormScreen={props.navToFormScreen} />

            {props.state.trips.map((trip, index) => {
                // check for not rendering current trip using index?

                // todo: not rendering for some reason. 
                <>
                    <RoutePolyline routePath={trip.routePath} current={false} />
                    <PrevObsPolylines trip={trip} navToFormScreen={props.navToFormScreen} />
                </>
            })}

        </MapView>

    </>
}
// todo: null check on map could be better

export default connector(TripMapComponent);


const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});

/*
<Marker
          coordinate={props.currentUserLocation}

        >
          <Image
            source={require("../assets/sheep_1.png")}
            style={{ width: 30, height: 30, opacity:0.7 }}

          />
        </Marker>
*/