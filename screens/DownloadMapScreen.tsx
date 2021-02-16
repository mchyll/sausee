import React, { useEffect, useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, LayoutRectangle, Alert, View, Text, Modal, Button } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { RootStackParamList } from "../shared/TypeDefinitions";
import { createTrip } from "../shared/ActionCreators";
import { startRouteTracking } from "../services/BackgroundLocationTracking";
import MapView, { Region, UrlTile } from "react-native-maps";
import { createMapDownloadTask, estimateDownloadTilesSize, IMapDownloadTask, ListenerSubscription } from "../services/MapDownload";
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import { DownloadProgressAnimation } from "../components/DownloadProgressAnimation";
import { getMapTileForCoords, getMapZoom } from "../shared/Utils";
import { MapCutoutHatchPattern } from "../components/MapCutoutHatchPattern";


const connector = connect(null, { createTrip });
type DownloadMapScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

const DownloadMapScreen = (props: DownloadMapScreenProps) => {
  const mapRef = useRef<MapView>(null);
  const downloadModalRef = useRef<DownloadMapModal>(null);

  const [mapRegion, setMapRegion] = useState({ latitude: 0, longitude: 0 } as Region);
  const [mapLayout, setMapLayout] = useState({ width: 0, height: 0, x: 0, y: 0 } as LayoutRectangle);
  const [showDownloadingModal, setShowDownloadingModal] = useState(false);

  // When entering DMS, zoom the map to a region nearby the user
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
      maxZoomLevel={19}
      style={{ flex: 1 }}
      provider="google"
      rotateEnabled={false}
      showsUserLocation={true}
      showsMyLocationButton={false}
      pitchEnabled={false}
      ref={mapRef}
      onRegionChange={setMapRegion}
      onLayout={e => setMapLayout(e.nativeEvent.layout)}>

      <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />

    </MapView>

    <MapCutoutHatchPattern />

    <FloatingAction
      showBackground={false}
      floatingIcon={<AntDesign name="download" color="#000" size={30} />}
      color="#007AFF"
      onPressMain={onDownloadPress}
    />

    {showDownloadingModal && <DownloadMapModal ref={downloadModalRef} onStartTrip={onStartTrip} onCancel={onDownloadCancel} />}

  </>
};
/* todo: ser color of floating actino button based on color palette */


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
