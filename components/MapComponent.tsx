//import { LocationData } from "expo-location";
import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView, { EventUserLocation, Polyline, Region, UrlTile } from "react-native-maps";


interface TripMapComponentProps {
    onSheepLocChangeComplete: (region: Region) => void;
    onUserLocationChange: (region:EventUserLocation) => void;
    //routePath: LocationData[];
}

export function TripMapComponent(props: TripMapComponentProps) {
    return <MapView
        mapType="none"
        style={styles.mapStyle}
        showsUserLocation={true}
        // showsMyLocationButton={true}
        // showsCompass={true}
        onRegionChangeComplete={props.onSheepLocChangeComplete}
        onUserLocationChange={props.onUserLocationChange}
    >

        <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />
        {/* <UrlTile urlTemplate={(FileSystem.documentDirectory ?? "") + "z{z}_x{x}_y{y}.png"} /> */}
        {/* <LocalTile pathTemplate={"${RNFS.DocumentDirectoryPath}/z{z}_x{x}_y{y}.png"} tileSize={256} /> */}

        
    </MapView>
}

const styles = StyleSheet.create({
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
});

/*
<Polyline
            coordinates={props.routePath.map(location => ({ latitude: location.coords.latitude, longitude: location.coords.longitude }))}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
            zIndex={100}
        />
*/