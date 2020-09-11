import React from 'react';
// import MapView, { UrlTile } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, ScrollView, Button } from 'react-native';
import { saveTiles, testDownload } from './mapsaver';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <ScrollView>
          <MapView style={styles.mapStyle}>
            <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />
          </MapView>
        </ScrollView> */}
        <Button title="PRESS ME AGAIN" onPress={() => saveTiles({ x: 8664, y: 4428 }, { x: 8664, y: 4428 }, 14)} />
        <Button title="Download yeah" onPress={testDownload} />
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
    height: Dimensions.get('window').height / 2
  }
});
