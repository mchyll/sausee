//import { LocationData } from "expo-location";
import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView, { EventUserLocation, Polyline, Region, UrlTile } from "react-native-maps";
import { Coordinates, Observation } from "../shared/TypeDefinitions";
import PrevObsPolylines from "./PrevObsPolylines";
import RoutePolyline from "./RoutePolyline";



interface TripMapComponentProps {
    onSheepLocChangeComplete: (region: Region) => void;
    onUserLocationChange: (region: EventUserLocation) => void;
    sheepLocation: Coordinates;
    currentUserLocation: Coordinates;
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

        <RoutePolyline/>
        <Polyline
            coordinates={[props.sheepLocation, props.currentUserLocation]}
            strokeColor="black"
            strokeWidth={4}
            lineDashPattern={[10, 20]}
        />

        <PrevObsPolylines />
    </MapView>
}
// todo: null check on map could be better

const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});