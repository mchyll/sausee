import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Region } from 'react-native-maps';
import { routePath, routeTrackingTask } from './BackgroundLocationTrackerTask';
import { TripMapComponent } from './components/MapComponent';
import { deleteDirectoryFiles, listDirectoryFiles, saveTiles } from './mapsaver';


TaskManager.defineTask("BackgroundLocationTracker", routeTrackingTask);

interface AppComponentState {
  region?: Region;
  routePath: Location.LocationData[];
}
export default class App extends React.Component<{}, AppComponentState> {

  private intervalId?: number;

  constructor(props: {}) {
    super(props);
    this.state = { routePath: [] };
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
      accuracy: Location.Accuracy.BestForNavigation,
      foregroundService: {
        notificationTitle: "Henter posisjon",
        notificationBody: "Yes yes yes"
      }
    })
      .then(() => console.log("Started tracking task"))
      .catch(err => console.error(err));

    this.intervalId = setInterval(() => this.setState({ routePath }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <TripMapComponent onRegionChangeComplete={(region) => this.setState({ region })} routePath={this.state.routePath} />
          <Text>Region: {JSON.stringify(this.state.region)}</Text>
          <Button title="Download sample area" onPress={() => this.downloadMapRegion()} />
          <Button title="Print filenames in directory" onPress={listDirectoryFiles} />
          <Button title="Delete all files in directory" onPress={deleteDirectoryFiles} />
          <Text>Number of route locations so far: {this.state.routePath.length}</Text>
        </ScrollView>
      </View>
    );
  }
}


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
