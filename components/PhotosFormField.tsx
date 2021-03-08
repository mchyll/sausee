import React, { useState } from "react";
import { Alert, Image, TouchableOpacity, View, Text, Dimensions, StyleSheet } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { SauseeState } from "../shared/TypeDefinitions";
import { CameraCapturedPicture } from "expo-camera";
import { CameraView } from "./CameraView";
import { addObservationPhoto, removeObservationPhoto } from "../shared/ActionCreators";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { getFilename } from "../shared/Utils";
import { formStyles } from "./FormStyles";
import { PhotoPreview } from "./PhotoPreview";


const connector = connect((state: SauseeState) => ({
  imagePaths: state.currentObservation?.type === "INJURED_SHEEP" || state.currentObservation?.type === "DEAD_SHEEP" ?
    state.currentObservation.imagePaths :
    null,
  editable: state.currentObservation?.editable ?? false
}), {
  addObservationPhoto,
  removeObservationPhoto
});

function ObservationPhotosFormField(props: ConnectedProps<typeof connector>) {
  const [cameraOpen, setCameraOpen] = useState(false);

  const handlePhoto = async (photo: CameraCapturedPicture) => {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "photos", { intermediates: true });

    const destinationUri = FileSystem.documentDirectory + "photos/" + getFilename(photo.uri);
    await FileSystem.copyAsync({
      from: photo.uri,
      to: destinationUri
    });

    props.addObservationPhoto(destinationUri);
    setCameraOpen(false);
  };

  const removePhoto = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    props.removeObservationPhoto(uri);
  };

  return <>
    <Text style={formStyles.groupTitle}>Bilder</Text>
    <View style={[formStyles.group, styles.photoContainer]}>

      {props.imagePaths?.map(uri =>
        <ObservationPhotoThumbnail
          key={uri}
          uri={uri}
          showRemoveButton={props.editable}
          onRemove={() => removePhoto(uri)}
        />
      )}

      {props.editable &&
        <TouchableOpacity onPress={() => setCameraOpen(true)} style={styles.addPhotoButton}>
          <MaterialIcons name="add-a-photo" size={42} />
          <Text style={styles.addPhotoButtonText}>Legg til{"\n"}bilde</Text>
        </TouchableOpacity>
      }

    </View>

    {cameraOpen && <CameraView onClose={() => setCameraOpen(false)} onPhotoTaken={handlePhoto} />}
  </>
}

interface ObservationPhotoThumbnailProps {
  uri: string,
  showRemoveButton: boolean,
  onRemove: () => void
}

function ObservationPhotoThumbnail(props: ObservationPhotoThumbnailProps) {
  const [showPreview, setShowPreview] = useState(false);

  const onRemovePress = () => {
    Alert.alert("Fjern bilde", "Er du sikker?", [
      { text: "Avbryt" },
      { text: "Fjern", style: "destructive", onPress: props.onRemove }
    ]);
  }

  return <>
    <View style={styles.thumbnail}>

      {props.showRemoveButton &&
        <TouchableOpacity
          onPress={onRemovePress}
          style={styles.thumbnailRemoveButton}
          hitSlop={{ left: 20, bottom: 20, top: 20, right: 20 }}
        >
          <MaterialCommunityIcons name="close-thick" size={26} color="white" />
        </TouchableOpacity>
      }

      <TouchableOpacity onPress={() => setShowPreview(true)}>
        <Image
          source={{ uri: props.uri, width: thumbnailSize, height: thumbnailSize }}
          style={styles.thumbnailImage}
        />
      </TouchableOpacity>

    </View>

    {showPreview && <PhotoPreview uri={props.uri} onClose={() => setShowPreview(false)} />}
  </>
}

const screenDim = Dimensions.get("screen");
const thumbnailSize = (Math.min(screenDim.width, screenDim.height) - 70) / 3;
const styles = StyleSheet.create({
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5
  },
  addPhotoButton: {
    width: thumbnailSize,
    height: thumbnailSize,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center"
  },
  addPhotoButtonText: {
    textAlign: "center",
    fontSize: 12
  },
  thumbnail: {
    margin: 10
  },
  thumbnailRemoveButton: {
    position: "absolute",
    zIndex: 10,
    borderRadius: 20,
    backgroundColor: "red",
    right: -8,
    top: -8
  },
  thumbnailImage: {
    borderRadius: 5
  }
});

export default connector(ObservationPhotosFormField);
