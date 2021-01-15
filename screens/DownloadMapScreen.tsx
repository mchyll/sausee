import React, { useEffect, useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, LayoutRectangle, Alert, View, Text } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { Coordinates, RootStackParamList } from "../shared/TypeDefinitions";
import { createTrip } from "../shared/ActionCreators";
import MapView, { Circle, Polygon, Region, UrlTile } from "react-native-maps";
import { estimateDownloadTiles } from "../services/MapDownload";
import * as FileSystem from 'expo-file-system';
import { isRouteTracking, startRouteTracking } from "../services/BackgroundLocationTracking";
import { FloatingAction } from "react-native-floating-action";
import { SimpleLineIcons } from '@expo/vector-icons';
import Svg, { Defs, Path, Pattern } from "react-native-svg";


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
  const [bounds, setBounds] = useState<Bounds>();
  const [useLocalTiles] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    isRouteTracking().then(setIsTracking)
  }, []);

  const onDownloadPress = () => Alert.alert(
    "Last ned kart",
    "Det vil kreve ca. 72 MB å laste ned det valgte kartutsnittet. Vil du fortsette?",
    [
      { text: "Avbryt", style: "cancel" },
      { text: "Last ned", onPress: downloadMapRegion }
    ]
  );

  const downloadMapRegion = () => {
    props.createTrip();
    const zoom = Math.round(getZoom(mapRegion, mapLayout.width));

    mapRef.current?.getMapBoundaries().then(bounds => {
      setBounds(bounds);

      const northEast = coordsToTile(bounds.northEast, zoom);
      const southWest = coordsToTile(bounds.southWest, zoom);

      const numTiles = estimateDownloadTiles({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
      console.log(`Downloading ${numTiles} tiles`);

      // saveTiles({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
      // setUseLocalTiles(true);

      // console.log("\n\n");

      return startRouteTracking();
    })
      .then(() => props.navigation.replace("TripMapScreen"))
      .catch(error => console.error("Can't proceed to TripMapScreen:", error));
  };

  return <>
    {/*<Text>Zoom og naviger i kartet slik at du ser et utsnitt av området du ønsker å gå oppsynstur i</Text>
    <Text>Zoom: {getZoom(mapRegion, mapLayout.width)}</Text>
    <Text>{isTracking ? "Tracking" : "Not tracking"}</Text>
    <Button title="Åpne modal" onPress={() => props.navigation.navigate("TestModalScreen")} />

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
      onLayout={e => setMapLayout(e.nativeEvent.layout)}
    >
      <UrlTile urlTemplate={useLocalTiles ?
        (FileSystem.documentDirectory ?? "") + "z{z}_x{x}_y{y}.png" :
        "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}"} />

      {bounds && <>
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
      </>}
    </MapView>

    <CutoutHatchPattern layout={mapLayout} />

    <FloatingAction
      floatingIcon={<SimpleLineIcons name="cloud-download" size={30} color="black" />}
      onPressMain={onDownloadPress}
      
    />
    {/*<IconButton featherIconName="download" onPress={onDownloadPress} />*/}
    {/* </View> */}
  </>
};
/* todo: ser color of floating actino button based on color palette */

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
  }
});

const CutoutHatchPattern = React.memo((props: { layout: LayoutRectangle }) => {

  const padding = 25;
  const color = "rgba(159,100,255,0.5)";

  const { width: w, height: h, x, y } = props.layout;

  if (w === undefined || h === undefined || x === undefined || y === undefined) {
    return null;
  }

  return (
    <View pointerEvents="none"
      style={{ position: "absolute", top: y, left: x, bottom: h - y, right: w - x }}>

      <Svg width={w} height={h}>
        <Defs>
          <Pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse">
            <Path d="M0 10 L10 0 H5 L0 5 M10 10 V5 L5 10" fill={color} />
          </Pattern>
        </Defs>

        <Path fill="url(#hatch)" fillRule="evenodd"
          d={`M0 0 H${w} V${h} H0 Z M${padding} ${padding} H${w - padding} V${h - padding} H${padding} Z`}
        />

        <Path fill={color} fillRule="evenodd" d={
          `M${padding} ${padding} H${w - padding} V${h - padding} H${padding} Z ` +
          `M${padding + 4} ${padding + 4} H${w - padding - 4} V${h - padding - 4} H${padding + 4} Z`}
        />
      </Svg>
    </View>
  )
});


export default connector(DownloadMapScreen);
