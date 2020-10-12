//import { LocationData } from "expo-location";
import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView, { EventUserLocation, Polyline, Region, UrlTile } from "react-native-maps";
import { Coordinates, Observation } from "../shared/TypeDefinitions";


interface TripMapComponentProps {
    onSheepLocChangeComplete: (region: Region) => void;
    onUserLocationChange: (region: EventUserLocation) => void;
    routePath: Coordinates[];
    sheepLocation: Coordinates;
    currentUserLocation: Coordinates;
    prevObservations: Observation[]; // todo: only need coordinates, not counts
}

export function TripMapComponent(props: TripMapComponentProps) {
    return <MapView
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

        <Polyline
            coordinates={props.routePath.map(location => ({ latitude: location.lat, longitude: location.lon }))}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
            zIndex={100}
        />
        <Polyline
            coordinates={[
                { latitude: props.sheepLocation.lat, longitude: props.sheepLocation.lon },
                { latitude: props.currentUserLocation.lat, longitude: props.currentUserLocation.lon }
            ]}
            strokeColor="black"
            strokeWidth={4}
            lineDashPattern={[10, 20]}
        />
        {props.prevObservations.map((ob, i) => ob.yourCoordinates && ob.sheepCoordinates ? <Polyline
            key={i}
            coordinates={[
                { latitude: ob.yourCoordinates.lat, longitude: ob.yourCoordinates.lon },
                { latitude: ob.sheepCoordinates.lat, longitude: ob.sheepCoordinates.lon}
            ]}
            strokeWidth={4}
            strokeColor="black"
            lineDashPattern={[10, 20]}
        /> : null )}
    </MapView>
}
// todo: null check on map could be better

const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});