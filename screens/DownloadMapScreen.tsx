import React, { useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Button, Dimensions, StyleSheet, TouchableOpacity, Text, View, ScrollView, LayoutRectangle, Image, Alert } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { Coordinates, RootStackParamList } from "../shared/TypeDefinitions";
import { createTrip } from "../shared/ActionCreators";
import MapView, { Circle, Polygon, Region, UrlTile } from "react-native-maps";
import { Feather } from '@expo/vector-icons';
import { deleteDirectoryFiles, estimateDownloadTiles, downloadTiles } from "../services/MapDownload";
import * as FileSystem from 'expo-file-system';


interface Bounds {
  northEast: Coordinates;
  southWest: Coordinates;
}

const connector = connect(null, { createTrip });
type DownloadMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

const DownloadMapScreen = (props: DownloadMapScreenProps) => {
  const mapRef = useRef<MapView>(null);
  const [mapRegion, setMapRegion] = useState({ latitude: 0, longitude: 0 } as Region);
  const [mapLayout, setMapLayout] = useState({ width: 0 } as LayoutRectangle);
  const [bounds, setBounds] = useState({} as Bounds);
  const [useLocalTiles, setUseLocalTiles] = useState(false);

  const onDownloadPressed = () => Alert.alert(
    "Last ned kart",
    "Det vil kreve ca. 72 MB å laste ned det valgte kartutsnittet. Vil du fortsette?",
    [
      { text: "Avbryt", style: "cancel" },
      { text: "Last ned", onPress: downloadMapRegion }
    ]
  );

  const downloadMapRegion = () => {
    console.log("Current layout:", mapLayout);
    console.log("Screen width:", Dimensions.get("window").width);

    console.log("Current region:", mapRegion);

    const zoom = Math.round(getZoom(mapRegion, mapLayout.width));
    console.log("Current zoom:", zoom);

    mapRef.current?.getMapBoundaries().then(bounds => {
      setBounds(bounds);
      console.log(bounds);
      const northEast = coordsToTile(bounds.northEast, zoom);
      const southWest = coordsToTile(bounds.southWest, zoom);
      console.log("North east tile:", northEast);
      console.log("South west tile:", southWest);

      const numTiles = estimateDownloadTiles({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
      console.log(`Downloading ${numTiles} tiles`);

      // saveTiles({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
      // setUseLocalTiles(true);

      console.log("\n\n");

      props.createTrip();
      props.navigation.replace("TripMapScreen");
    });
  };

  return <>
    {/* <View style={styles.container}> */}
    <Text>Zoom og naviger i kartet slik at du ser et utsnitt av området du ønsker å gå oppsynstur i</Text>
    <Text>Zoom: {getZoom(mapRegion, mapLayout.width)}</Text>

    {/* <Button title="Delete local tiles" onPress={() => {
      deleteDirectoryFiles().then(() => {
        console.log("Done cleaning");
        setUseLocalTiles(false);
        setBounds({} as Bounds);
      });
    }} /> */}

    <MapView
      style={styles.mapView}
      mapType="none"
      rotateEnabled={false}
      showsUserLocation={true}
      pitchEnabled={false}
      ref={mapRef}
      onRegionChange={setMapRegion}

      // TODO: Fix more stable way of getting current map viewport width
      onLayout={e => {
        console.log("onLayout:", e.nativeEvent);
        setMapLayout(e.nativeEvent.layout)
      }}
    >
      <UrlTile urlTemplate={useLocalTiles ?
        (FileSystem.documentDirectory ?? "") + "z{z}_x{x}_y{y}.png" :
        "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}"} />

      {bounds.northEast && bounds.southWest ? <>
        <Circle center={bounds.northEast} radius={1} strokeWidth={15} strokeColor="#F0F" />
        <Circle center={bounds.southWest} radius={1} strokeWidth={15} strokeColor="#F0F" />
        <Polygon
          coordinates={[
            bounds.northEast,
            { latitude: bounds.northEast.latitude, longitude: bounds.southWest.longitude },
            bounds.southWest,
            { latitude: bounds.southWest.latitude, longitude: bounds.northEast.longitude }
          ]}
          strokeColor="#F0F" />
      </> : null}
    </MapView>

    <TouchableOpacity
      style={styles.circularTouchable}
      onPress={onDownloadPressed}
    >
      <Feather name="download" style={styles.downloadIcon} />
    </TouchableOpacity>
    {/* </View> */}
  </>
};

/*
function coordsToTile(coords: Coordinates, zoomLevel: number) {
  const k = 256 / (2 * Math.PI) * Math.pow(2, zoomLevel);
  const xPixel = Math.floor(k * (coords.longitude + Math.PI));
  const yPixel = Math.floor(k * (Math.PI - Math.log(Math.tan(Math.PI / 4 + coords.latitude / 2))));
  return { xPixel, yPixel };
}

function getZoomLevelFromRegion(region: Region, viewportWidth: number) {
  const { longitudeDelta } = region;

  // Normalize longitudeDelta which can assume negative values near central meridian
  const lngD = (360 + longitudeDelta) % 360;

  // Calculate the number of tiles currently visible in the viewport
  const tiles = viewportWidth / 256;

  // Calculate the currently visible portion of the globe
  const portion = lngD / 360;

  // Calculate the portion of the globe taken up by each tile
  const tilePortion = portion / tiles;

  // Return the zoom level which splits the globe into that number of tiles
  return Math.log2(1 / tilePortion);
}
*/

function coordsToTile(coords: Coordinates, zoom: number) {
  return {
    x: Math.floor((coords.longitude + 180) / 360 * Math.pow(2, zoom)),
    y: Math.floor((1 - Math.log(Math.tan(coords.latitude * Math.PI / 180) + 1 / Math.cos(coords.latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
  };
}

function getZoom(region: Region, viewportWidth: number) {
  return (Math.log2(360 * ((viewportWidth / 256) / region.longitudeDelta)) + 1); // Math.round
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%",
    // height: "100%",
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height
  },
  mapView: {
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height
    // width: "100%",
    // height: "100%",
    flex: 1
  },
  circularTouchable: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    position: "absolute",
    bottom: 25,
    left: 25
  },
  downloadIcon: {
    fontSize: 30,
    color: "black"
  }
});

export default connector(DownloadMapScreen);
