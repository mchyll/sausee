import React from "react";
import { Modal, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CloseIconButton } from "./CloseIconButton";


interface PhotoPreviewProps {
  uri: string,
  onClose: () => void
}

export function PhotoPreview(props: PhotoPreviewProps) {
  return (
    <Modal
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={props.onClose}
    >
      <SafeAreaView edges={["top"]} style={StyleSheet.absoluteFill}>
        <CloseIconButton onPress={props.onClose} />
        <Image source={{ uri: props.uri }} style={StyleSheet.absoluteFill} />
      </SafeAreaView>
    </Modal>
  );
}
