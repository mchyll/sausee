import React, { useEffect, useState } from 'react';
import MapView, { UrlTile, LocalTile, Region, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, ScrollView, Button, Image } from 'react-native';
import { saveTiles, listDirectoryFiles, deleteDirectoryFiles } from './mapsaver';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { MapComponent } from './MapComponent';
import { LocationComponent } from './LocationComponent';


interface AppComponentState {
  region?: Region;
}
export default class App extends React.Component<{}, AppComponentState> {

  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  downloadMapRegion() {
    saveTiles({ x: 0, y: 0 }, { x: 0, y: 0 }, 0, 4);
  }

  async componentDidMount() {
    let result = await Location.requestPermissionsAsync();
    console.log(result);
    if (result.status !== 'granted') {
      console.error('Permission to access location was denied');
    }

    Location.startLocationUpdatesAsync("BackgroundLocationTracker", {
      foregroundService: {
        notificationTitle: "Henter posisjon",
        notificationBody: "Yes yes yes"
      }
    })
      .then(() => console.log("Started tracking task"))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <MapComponent onRegionChangeComplete={(region) => this.setState({ region })} />
          <Text>Region: {JSON.stringify(this.state.region)}</Text>
          <Button title="Download sample area" onPress={() => this.downloadMapRegion()} />
          <Button title="Print filenames in directory" onPress={listDirectoryFiles} />
          <Button title="Delete all files in directory" onPress={deleteDirectoryFiles} />
          {/* <LocationComponent /> */}
        </ScrollView>
      </View>
    );
  }
}

TaskManager.defineTask("BackgroundLocationTracker", (body: TaskManager.TaskManagerTaskBody) => {
  if (body.error) {
    // check `error.message` for more details.
    return;
  }
  let locations = body.data as Location[];
  console.log('Received new locations', locations);
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.5
  },
  tinyLogo: {
    width: 256,
    height: 256,
  }
});
