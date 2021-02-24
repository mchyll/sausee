import { Camera, CameraCapturedPicture } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { CloseIconButton } from "./CloseIconButton";


interface CameraViewProps {
  onClose: () => void,
  onPhotoTaken: (photo: CameraCapturedPicture) => void
}

export function CameraView(props: CameraViewProps) {

  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const camera = useRef<Camera>(null);

  useEffect(() => {
    Camera.requestPermissionsAsync().then(({ granted }) => {
      if (granted) {
        setCameraPermissionGranted(true);
      }
      else {
        console.log("Nope, no camera for you");
      }
    })
  }, []);

  const onCapturePress = async () => {
    if (cameraReady) {
      setPhotoLoading(true);
      Haptics.impactAsync();
      const photo = await camera.current?.takePictureAsync();
      if (photo) {
        props.onPhotoTaken(photo);
      }
    }
  };

  return (
    <Modal
      visible={cameraPermissionGranted}
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={props.onClose}
    >
      <Camera
        ref={camera}
        style={{ flex: 1 }}
        onCameraReady={() => setCameraReady(true)}
      >
        <SafeAreaView edges={["top"]} style={styles.controlsContainer}>

          <CloseIconButton onPress={props.onClose} />

          <View style={styles.captureButtonContainer}>
            <TouchableOpacity onPress={onCapturePress} style={styles.captureButton}>
              <MaterialIcons name="camera-alt" size={26} color="black" />
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </Camera>

      {photoLoading &&
        <View style={styles.loadingView}>
          <Text style={styles.loadingText}>Jobber med saken...</Text>
        </View>
      }
    </Modal>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  captureButtonContainer: {
    alignItems: "center",
    marginBottom: 20
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)"
  },
  loadingText: {
    fontSize: 32,
    color: "white"
  }
});
