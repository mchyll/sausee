//import { LocationData } from "expo-location";
import React from "react";
import { StyleSheet, Dimensions, View, Image } from "react-native";
import MapView, { EventUserLocation, Marker, Polyline, Region, UrlTile } from "react-native-maps";
import { Coordinates, Observation } from "../shared/TypeDefinitions";
import PrevObsPolylines from "./PrevObsPolylines";
import RoutePolyline from "./RoutePolyline";




interface TripMapComponentProps {
    onSheepLocChangeComplete: (region: Region) => void;
    onUserLocationChange: (region: EventUserLocation) => void;
    sheepLocation: Coordinates;
    currentUserLocation: Coordinates;
    navToFormScreen: () => void;
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

        <RoutePolyline />
        <Polyline
            coordinates={[props.sheepLocation, props.currentUserLocation]}
            strokeColor="black"
            strokeWidth={4}
            lineDashPattern={[10, 20]}
        />
        <View pointerEvents="none" style={{ position: "absolute", justifyContent: "center", alignItems: "center", top: 0, left: 0, right: 0, bottom: 0 }}>
            <Image style={{ width: 100, height: 100 }} source={require("../assets/sniper.png")} />
        </View>
        

        <PrevObsPolylines navToFormScreen={props.navToFormScreen}/>
    </MapView>
}
// todo: null check on map could be better

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