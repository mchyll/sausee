import { LocationData } from "expo-location";
import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView, { Polyline, Region, UrlTile } from "react-native-maps";


interface MapComponentProp {
    onRegionChangeComplete: (region: Region) => void;
    routePath: LocationData[];
}

export function TripMapComponent(props: MapComponentProp) {
    return <MapView
        mapType="none"
        style={styles.mapStyle}
        showsUserLocation={true}
        // showsMyLocationButton={true}
        // showsCompass={true}
        onRegionChangeComplete={props.onRegionChangeComplete}>

        <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />
        {/* <UrlTile urlTemplate={(FileSystem.documentDirectory ?? "") + "z{z}_x{x}_y{y}.png"} /> */}
        {/* <LocalTile pathTemplate={"${RNFS.DocumentDirectoryPath}/z{z}_x{x}_y{y}.png"} tileSize={256} /> */}

        <Polyline
            coordinates={props.routePath.map(location => ({ latitude: location.coords.latitude, longitude: location.coords.longitude }))}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
            zIndex={100}
        />
    </MapView>
}

const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.5
    }
});
