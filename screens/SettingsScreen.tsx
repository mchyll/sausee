import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../shared/TypeDefinitions";
import { Alert, Button, StyleSheet, View } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { resetState } from "../shared/ActionCreators";
import { deleteDownloadedTiles } from "../services/MapDownload";
import * as FileSystem from "expo-file-system";


const connector = connect(null, { resetState });

function SettingsScreen(props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "SettingsScreen">) {
  const onDeleteTilesPress = () =>
    Alert.alert("Slett kartfiler", "Dersom du ønsker å bruke kart uten internett igjen må du laste ned kartet på nytt. Er du sikker?", [
      { text: "Avbryt", style: "cancel" },
      { text: "Slett", style: "destructive", onPress: deleteDownloadedTiles }
    ]);

  const onResetStatePress = () =>
    Alert.alert("Slett alle oppsynsturer", "Alle oppsynsturer vil slettes for godt. Er du sikker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett", style: "destructive", onPress: () => {
          deleteAllObservationPhotos();
          props.resetState();
        }
      }
    ]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <Button title="Slett kartfiler" onPress={onDeleteTilesPress} />
      </View>

      <View style={styles.buttonGroup}>
        <Button title="Slett alle oppsynsturer" onPress={onResetStatePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15
  },
  buttonGroup: {
    marginTop: 30
  }
});

async function deleteAllObservationPhotos() {
  const dir = FileSystem.documentDirectory + "photos/";
  for (const photo of await FileSystem.readDirectoryAsync(dir)) {
    const uri = dir + photo;
    console.log("Deleting photo", uri);
    await FileSystem.deleteAsync(uri);
  }
}

export default connector(SettingsScreen);
