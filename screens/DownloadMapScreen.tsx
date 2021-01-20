import React, { useEffect, useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, LayoutRectangle, Alert, View, Text, Modal, Button } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { Coordinates, RootStackParamList } from "../shared/TypeDefinitions";
import { createTrip } from "../shared/ActionCreators";
import MapView, { Circle, Polygon, Region, UrlTile } from "react-native-maps";
import { createMapDownloadTask, estimateDownloadTiles, IMapDownloadTask, ListenerSubscription } from "../services/MapDownload";
import * as FileSystem from 'expo-file-system';
import { isRouteTracking, startRouteTracking } from "../services/BackgroundLocationTracking";
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from "@expo/vector-icons";
import Svg, { Defs, Path, Pattern } from "react-native-svg";
import * as Location from "expo-location";
import { DownloadProgressAnimation } from "../components/DownloadProgressAnimation";


interface Bounds {
  northEast: Coordinates;
  southWest: Coordinates;
}

const connector = connect(null, { createTrip });
type DownloadMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

const DownloadMapScreen = (props: DownloadMapScreenProps) => {
  const mapRef = useRef<MapView>(null);
  const fabRef = useRef<FloatingAction>(null);
  const downloadModalRef = useRef<DownloadMapModal>(null);

  const [mapRegion, setMapRegion] = useState({ latitude: 0, longitude: 0 } as Region);
  const [mapLayout, setMapLayout] = useState({ width: 0 } as LayoutRectangle);
  const [bounds, setBounds] = useState<Bounds>();
  const [useLocalTiles] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showDownloadingModal, setShowDownloadingModal] = useState(false);

  useEffect(() => {
    Location.requestPermissionsAsync().then(res => {
      if (res.granted) {
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }).then(pos => {
          mapRef.current?.animateToRegion({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        });
      }
    })
    isRouteTracking().then(setIsTracking).catch(err => console.log("Sorry, cant call isroutetracking:", err));
  }, []);

  const onDownloadPress = () => {
    setTimeout(() => fabRef.current?.setState({ active: false }), 1);  // Dirtiest hack in the west

    Alert.alert(
      "Last ned kart",
      "Det vil kreve ca. 72 MB å laste ned det valgte kartutsnittet. Vil du fortsette?",
      [
        { text: "Avbryt", style: "cancel" },
        { text: "Last ned", onPress: onDownloadConfirmed }
      ]
    );
  }

  const onDownloadConfirmed = async () => {
    if (mapRef.current === null) return;

    const zoom = Math.round(getZoom(mapRegion, mapLayout.width));

    const bounds = await mapRef.current.getMapBoundaries();
    setBounds(bounds);

    const northEast = coordsToTile(bounds.northEast, zoom);
    const southWest = coordsToTile(bounds.southWest, zoom);

    const numTiles = estimateDownloadTiles({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
    console.log(`Downloading ${numTiles} tiles`);

    // saveTiles({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
    // setUseLocalTiles(true);

    // console.log("\n\n");

    const downloadTask = createMapDownloadTask({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
    setShowDownloadingModal(true);
    downloadModalRef.current?.startDownload(downloadTask);
    // await downloadTask.startDownloadAsync();
    // await delay(5000);
    // setShowDownloadingModal(false);
    // deactivateFab();

    // props.createTrip(mapRegion);

    // await startRouteTracking();

    // props.navigation.replace("TripMapScreen");

    // .catch(error => console.error("Can't proceed to TripMapScreen:", error));
  };

  const onDownloadCancel = () => {
    setShowDownloadingModal(false);
  };

  const onStartTrip = async () => {
    props.createTrip(mapRegion);
    await startRouteTracking();
    props.navigation.replace("TripMapScreen");
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
      showsMyLocationButton={true}
      pitchEnabled={false}
      ref={mapRef}
      onRegionChange={setMapRegion}
      onLayout={e => setMapLayout(e.nativeEvent.layout)}>

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

    <MapCutoutHatchPattern layout={mapLayout} />

    <FloatingAction
      ref={fabRef}
      floatingIcon={<AntDesign name="download" color="#000" size={30} />}
      onPressMain={onDownloadPress}
    />

    {showDownloadingModal && <DownloadMapModal ref={downloadModalRef} onStartTrip={onStartTrip} onCancel={onDownloadCancel} />}

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

const MapCutoutHatchPattern = React.memo((props: { layout: LayoutRectangle }) => {

  const padding = 25;
  // const color = "rgba(159,100,255,0.5)";
  const color = "rgba(0,100,200,0.4)";

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

interface DownloadMapModalProps {
  onCancel: () => void;
  onStartTrip: () => void;
}
class DownloadMapModal extends React.Component<DownloadMapModalProps, { completed: boolean }> {

  constructor(props: DownloadMapModalProps) {
    super(props);
    this.state = { completed: false };
  }

  private mounted = false;
  private downloadTask?: IMapDownloadTask;
  private progressAnimationRef = React.createRef<DownloadProgressAnimation>();
  private progressSubscription?: ListenerSubscription;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.progressSubscription?.unsubscribe();
    this.mounted = false;
  }

  startDownload(downloadTask: IMapDownloadTask) {
    this.downloadTask = downloadTask;
    this.progressSubscription = this.downloadTask.addProgressListener(progress => {
      this.progressAnimationRef.current?.setProgress(progress.progress);
    });
    this.downloadTask.startDownloadAsync().then(completed => {
      if (completed && this.mounted) {
        this.setState({ completed: true });
      }
    });
  }

  private cancelDownload() {
    this.downloadTask?.cancelDownload();
    this.props.onCancel();
  }

  render() {
    return <Modal transparent={true} animationType="fade" statusBarTranslucent={true}>
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: 250, height: 300, backgroundColor: "white", borderRadius: 10, padding: 10, justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 20, marginTop: 5 }}>
            {this.state.completed ? "Ferdig lastet ned" : "Laster ned kart"}
          </Text>
          <DownloadProgressAnimation ref={this.progressAnimationRef} size={150} />
          {this.state.completed ?
            <Button onPress={() => this.props.onStartTrip()} title="Start oppsynstur" /> :
            <Button onPress={() => this.cancelDownload()} title="Avbryt nedlastning" />
          }
        </View>
      </View>
    </Modal>
  }
}

export default connector(DownloadMapScreen);
