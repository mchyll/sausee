import React, { useEffect, useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, LayoutRectangle, Alert, View, Text, Modal, Button } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { RootStackParamList } from "../shared/TypeDefinitions";
import { createTrip } from "../shared/ActionCreators";
import { startRouteTracking } from "../services/LocationTracking";
import MapView, { Region, UrlTile } from "react-native-maps";
import { createMapDownloadTask, estimateDownloadTilesSize, IMapDownloadTask, ListenerSubscription } from "../services/MapDownload";
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import { DownloadProgressAnimation } from "../components/DownloadProgressAnimation";
import { getMapTileForCoords, getMapZoom } from "../shared/Utils";
import { MapCutoutHatchPattern } from "../components/MapCutoutHatchPattern";
import { MAX_ZOOM } from "../shared/constants";


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

  const getBounds = async (mapRefCurrent: MapView) => {

    const zoom = Math.max(getMapZoom(mapRegion, mapLayout.width) - 1, 0);

    const bounds = await mapRefCurrent.getMapBoundaries();
    const northEast = getMapTileForCoords(bounds.northEast, zoom);
    const southWest = getMapTileForCoords(bounds.southWest, zoom);

    return {topLeft: { x: southWest.x, y: northEast.y }, bottomRight: { x: northEast.x, y: southWest.y }, startZoom: zoom, endZoom: MAX_ZOOM};
  }

  const onDownloadPress = async () => {
    let estimatedSizeStr = "ukjent";
    if (mapRef.current) {
      const bounds = await getBounds(mapRef.current);
      estimatedSizeStr = estimateDownloadTilesSize(bounds.topLeft, bounds.bottomRight, bounds.startZoom, bounds.endZoom);
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

    const bounds = await getBounds(mapRef.current);

    const downloadTask = createMapDownloadTask(bounds.topLeft, bounds.bottomRight, bounds.startZoom, bounds.endZoom);
    setShowDownloadingModal(true);
    downloadModalRef.current?.startDownload(downloadTask);
  };

  const onDownloadCancel = () => {
    setShowDownloadingModal(false);
  };

  const onStartTrip = async () => {
    props.createTrip(mapRegion);
    await startRouteTracking();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "TripMapScreen" }]
    });
  };

  const onSkipFabPress = () => {
    return (
      Alert.alert("Hopp over nedlastning av kart?", "Er du sikker på at du vil hoppe over nedlastningen av kart? Dette kan føre til at du ikke vil få opp kartet du trenger hvis du ikke har god nok dekning.", [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Hopp over", style: "default", onPress: () => {
            onStartTrip();
          }
        }
      ])
    );
  }

  return <>

    <MapView
      maxZoomLevel={MAX_ZOOM - 1}
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

    <View style={{ ...StyleSheet.absoluteFillObject, bottom: 80 }} pointerEvents="box-none">
      <FloatingAction
        color="white"
        showBackground={false}
        floatingIcon={<AntDesign name="arrowright" size={24} color="black" />}
        onPressMain={onSkipFabPress}
      />
    </View>

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
