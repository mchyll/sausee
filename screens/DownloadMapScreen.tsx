import React, { useEffect, useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, LayoutRectangle, Alert, View, Text, Modal, Button } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { RootStackParamList } from "../shared/TypeDefinitions";
import { createTrip } from "../shared/ActionCreators";
import MapView, { Region, UrlTile } from "react-native-maps";
import { createMapDownloadTask, estimateDownloadTilesSize, IMapDownloadTask, ListenerSubscription } from "../services/MapDownload";
import { startRouteTracking } from "../services/BackgroundLocationTracking";
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from "@expo/vector-icons";
import Svg, { Defs, Path, Pattern } from "react-native-svg";
import * as Location from "expo-location";
import { DownloadProgressAnimation } from "../components/DownloadProgressAnimation";
import { getMapTileForCoords, getMapZoom } from "../shared/Utils";


const connector = connect(null, { createTrip });
type DownloadMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

const DownloadMapScreen = (props: DownloadMapScreenProps) => {
  const mapRef = useRef<MapView>(null);
  const fabRef = useRef<FloatingAction>(null);
  const downloadModalRef = useRef<DownloadMapModal>(null);

  const [mapRegion, setMapRegion] = useState({ latitude: 0, longitude: 0 } as Region);
  const [mapLayout, setMapLayout] = useState({ width: 0 } as LayoutRectangle);
  const [showDownloadingModal, setShowDownloadingModal] = useState(false);

  useEffect(() => {
    Location.requestPermissionsAsync().then(res => {
      if (res.granted) {
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }).then(pos => {
          mapRef.current?.animateToRegion({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        });
      }
    })
  }, []);

  const onDownloadPress = async () => {
    setTimeout(() => fabRef.current?.setState({ active: false }), 1);  // Dirtiest hack in the west

    let estimatedSizeStr = "ukjent";
    if (mapRef.current) {
      const zoom = Math.round(getMapZoom(mapRegion, mapLayout.width));

      const bounds = await mapRef.current.getMapBoundaries();
      const northEast = getMapTileForCoords(bounds.northEast, zoom);
      const southWest = getMapTileForCoords(bounds.southWest, zoom);

      estimatedSizeStr = estimateDownloadTilesSize({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
    }

    Alert.alert(
      "Last ned kart",
      `Det vil kreve omtrent ${estimatedSizeStr} lagringsplass å laste ned det valgte kartutsnittet. Vil du fortsette?`,
      [
        { text: "Avbryt", style: "cancel" },
        { text: "Last ned", onPress: onDownloadConfirmed }
      ]
    );
  }

  const onDownloadConfirmed = async () => {
    if (mapRef.current === null) {
      return;
    }

    const zoom = Math.round(getMapZoom(mapRegion, mapLayout.width));

    const bounds = await mapRef.current.getMapBoundaries();
    const northEast = getMapTileForCoords(bounds.northEast, zoom);
    const southWest = getMapTileForCoords(bounds.southWest, zoom);

    const downloadTask = createMapDownloadTask({ x: southWest.x, y: northEast.y }, { x: northEast.x, y: southWest.y }, zoom, 20);
    setShowDownloadingModal(true);
    downloadModalRef.current?.startDownload(downloadTask);
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

    <MapView
      style={{ flex: 1 }}
      mapType="none"
      rotateEnabled={false}
      showsUserLocation={true}
      showsMyLocationButton={true}
      pitchEnabled={false}
      ref={mapRef}
      onRegionChange={setMapRegion}
      onLayout={e => setMapLayout(e.nativeEvent.layout)}>

      <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />

    </MapView>

    <MapCutoutHatchPattern layout={mapLayout} />

    <FloatingAction
      ref={fabRef}
      floatingIcon={<AntDesign name="download" color="#000" size={30} />}
      color="#007AFF"
      onPressMain={onDownloadPress}
    />

    {showDownloadingModal && <DownloadMapModal ref={downloadModalRef} onStartTrip={onStartTrip} onCancel={onDownloadCancel} />}

  </>
};
/* todo: ser color of floating actino button based on color palette */

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
