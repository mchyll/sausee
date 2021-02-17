import { StackScreenProps } from '@react-navigation/stack';
import React, { Component } from 'react';
import { Image, Pressable, View, Text, Button, Alert, StyleSheet, PanResponder } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { finishTrip } from "../shared/ActionCreators";
import { Observation, ObservationCounters, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { stopRouteTracking } from "../services/BackgroundLocationTracking";
import { deleteDirectoryFiles } from '../services/MapDownload';
import StartScreen from './StartScreen';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import TripMapComponent from '../components/TripMapComponent';
import MapView, { UrlTile } from 'react-native-maps';
import { RoutePolyline } from '../components/RoutePolyline';
import PrevObsPolylines from '../components/PrevObsPolylines';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const mapStateToProps = (state: SauseeState) => {
  //currentTripId: state.currentTripId,
  const trip = state.trips.find(trip => state.currentTripId === trip.id);
  //if (!trip) trip = {}
  let observationTotal: ObservationCounters = {
    sheepCountTotal: 0,
    whiteGreySheepCount: 0,
    blackSheepCount: 0,
    brownSheepCount: 0,
    blueTieCount: 0,
    greenTieCount: 0,
    yellowTieCount: 0,
    redTieCount: 0,
    missingTieCount: 0,
  };
  if (trip)
    for (const [key, value] of Object.entries(trip.observations)) {
      // operator overloading does not exist in javascript (or typescript) :(
      // https://stackoverflow.com/questions/19620667/javascript-operator-overloading
      // https://stackoverflow.com/questions/36110070/does-typescript-have-operator-overloading
      observationTotal.sheepCountTotal += value.sheepCountTotal;
      observationTotal.whiteGreySheepCount += value.whiteGreySheepCount;
      observationTotal.blackSheepCount += value.blackSheepCount;
      observationTotal.brownSheepCount += value.brownSheepCount;
      // tie counts are set in object initialization, hence the '!'.
      observationTotal.blueTieCount! += value.blueTieCount ?? 0;
      observationTotal.greenTieCount! += value.greenTieCount ?? 0;
      observationTotal.yellowTieCount! += value.yellowTieCount ?? 0;
      observationTotal.redTieCount! += value.redTieCount ?? 0;
      observationTotal.missingTieCount! += value.missingTieCount ?? 0;
    }

  return {
    observationTotal,
    trip,
  }

  // summer alle observasjonene til trippen
};

const connector = connect(mapStateToProps, { finishTrip });

type StartScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "StartScreen">

const imageSize = 70; // was 100
const margin = 10;
const ReceiptScreen = (props: StartScreenProps) => {
  return (
    <SafeAreaView style={{flex: 1}} edges={["bottom"]}>
      <View style={{ justifyContent: "space-between", flexGrow: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: margin }}>
          <View>
            <Image
              style={{ width: imageSize, height: imageSize, resizeMode: "contain", }}
              source={require("../assets/multiple-sheep.png")}
            />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.sheepCountTotal}</Text>
          </View>
          <View>
            <Image
              style={{ width: imageSize, height: imageSize, resizeMode: "contain", }}
              source={require("../assets/sheep_1.png")}
            />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.whiteGreySheepCount}</Text>
          </View>
          <View>
            <Image
              style={{ width: imageSize, height: imageSize, resizeMode: "contain", }}
              source={require("../assets/brown-sheep.png")}
            />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.brownSheepCount}</Text>
          </View>
          <View>
            <Image
              style={{ width: imageSize, height: imageSize, resizeMode: "contain", }}
              source={require("../assets/black-sheep.png")}
            />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.blackSheepCount}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: margin }}>
          <View>
            <MaterialCommunityIcons name="tie" size={imageSize} color="#05d" />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.blueTieCount}</Text>
          </View>
          <View>
            <MaterialCommunityIcons name="tie" size={imageSize} color="#070" />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.greenTieCount}</Text>
          </View>
          <View>
            <MaterialCommunityIcons name="tie" size={imageSize} color="#f4d528" />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.yellowTieCount}</Text>
          </View>
          <View>
            <MaterialCommunityIcons name="tie" size={imageSize} color="#d22" />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.redTieCount}</Text>
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <AntDesign name="close" size={60} color="black" />
            <Text style={{ alignSelf: "center" }}>{props.observationTotal.missingTieCount}</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", flexGrow: 1 }}>
          <MapView
            style={{ width: "80%", flexGrow: 1 }}
            maxZoomLevel={20}
            pitchEnabled={false}
            provider="google"
            showsUserLocation={true}
            initialRegion={props.trip?.mapRegion}
          >
            <UrlTile urlTemplate="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}" />


            <RoutePolyline routePath={props.trip?.routePath} current={true} />
            <PrevObsPolylines trip={props.trip} navToFormScreen={() => { }} current={true} />
          </MapView>
        </View>





        <View style={{ alignItems: "center", marginVertical: margin }}>
          <Button
            title={"Avslutt oppsynstur"}
            onPress={() => {
              Alert.alert("Avslutt oppsynstur", "Er du sikker?", [
                { text: "Avbryt", style: "cancel" },
                {
                  text: "OK", onPress: () => {
                    props.finishTrip();
                    stopRouteTracking();
                    props.navigation.reset({
                      index: 0,
                      routes: [{ name: "StartScreen" }]
                    });
                  }
                }
              ]);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default connector(ReceiptScreen);

{/*<UrlTile urlTemplate={(FileSystem.documentDirectory ?? "") + "z{z}_x{x}_y{y}.png"} />*(})
        {/* <LocalTile pathTemplate={"${RNFS.DocumentDirectoryPath}/z{z}_x{x}_y{y}.png"} tileSize={256} /> */}