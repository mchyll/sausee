import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, LayoutRectangle, View } from "react-native";
import MapView, { EventUserLocation, Polyline, Region, UrlTile } from "react-native-maps";
import { connect, ConnectedProps } from "react-redux";
import { Coordinates, SauseeState } from "../shared/TypeDefinitions";
import { CenterCross } from "./CenterCross";
import PrevObsPolylines from "./PrevObsPolylines";
import { RoutePolyline } from "./RoutePolyline";


interface TripMapComponentProps {
  onSheepLocationChangeComplete: (region: Region) => void,
  sheepLocation: Coordinates,
  currentUserLocation: Coordinates,
  navToFormScreen: () => void,
  oldTripIndex: number,
  onUserLocationChange: (event: EventUserLocation) => void
}

const mapStateToProps = (state: SauseeState, ownProps: TripMapComponentProps) => ({
  trip: state.trips.find(trip => state.currentTripId === trip.id),
  previousTrip: ownProps.oldTripIndex >= 0 && ownProps.oldTripIndex < state.trips.length ? state.trips[ownProps.oldTripIndex] : null
});

const connector = connect(mapStateToProps);

const TripMapComponent = (props: ConnectedProps<typeof connector> & TripMapComponentProps) => {
  //#region Map center debugging
  const mapRef = useRef<MapView>(null);
  const [mapLayout, setMapLayout] = useState<LayoutRectangle>();

  useEffect(() => {
    // mapRef.current?.getCamera().then(c => {
    //   console.log(`Camera center: ${c.center.latitude.toFixed(8)} ${c.center.longitude.toFixed(8)}`);
    //   console.log(`Region center: ${props.sheepLocation.latitude.toFixed(8)} ${props.sheepLocation.longitude.toFixed(8)}\n`);
    // });
  }, [props.sheepLocation]);
  //#endregion

  return <>
    <MapView ref={mapRef} onLayout={l => setMapLayout(l.nativeEvent.layout)}
      provider="google"
      style={StyleSheet.absoluteFill}
      showsUserLocation={true}
      showsMyLocationButton={false}
      // showsCompass={true}
      onUserLocationChange={props.onUserLocationChange}
      onRegionChangeComplete={props.onSheepLocationChangeComplete}
      initialRegion={props.trip?.mapRegion}
    >

      <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />
      {/* <UrlTile urlTemplate={(FileSystem.documentDirectory ?? "") + "z{z}_x{x}_y{y}.png"} /> */}
      {/* <LocalTile pathTemplate={"${RNFS.DocumentDirectoryPath}/z{z}_x{x}_y{y}.png"} tileSize={256} /> */}

      <Polyline // preview line
        coordinates={[props.sheepLocation, props.currentUserLocation]}
        strokeWidth={3}
        zIndex={10}
        strokeColor="rgba(0, 0, 0, 0.5)"
      />

      <RoutePolyline routePath={props.trip?.routePath} current={true} />
      <PrevObsPolylines trip={props.trip} navToFormScreen={props.navToFormScreen} current={true} />

      {props.previousTrip && <>
        <RoutePolyline routePath={props.previousTrip.routePath} current={false} />
        <PrevObsPolylines trip={props.previousTrip} navToFormScreen={props.navToFormScreen} current={false} />
      </>}

    </MapView>

    {/*<CenterCross layout={mapLayout} />*/}

  </>
}
// todo: null check on map could be better

export default connector(TripMapComponent);

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