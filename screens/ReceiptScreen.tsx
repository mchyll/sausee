import { StackScreenProps } from '@react-navigation/stack';
import React, { Component } from 'react';
import { Image, Pressable, View, Text, Button, Alert, StyleSheet, PanResponder } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { finishTrip } from "../shared/ActionCreators";
import { SheepObservation, SheepCounters, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { stopRouteTracking } from "../services/BackgroundLocationTracking";
import { deleteDirectoryFiles, tileTemplateWithPath } from '../services/MapDownload';
import StartScreen from './StartScreen';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import TripMapComponent from '../components/TripMapComponent';
import MapView, { Region, UrlTile } from 'react-native-maps';
import { RoutePolyline } from '../components/RoutePolyline';
import PrevObsPolylines from '../components/PrevObsPolylines';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from "expo-file-system";
import { DeadSheepIcon, InjuredSheepIcon, PredatorIcon } from '../components/ObservationIcons';



const mapStateToProps = (state: SauseeState) => {
  //currentTripId: state.currentTripId,
  const trip = state.trips.find(trip => state.currentTripId === trip.id);
  //if (!trip) trip = {}
  let observationsTotal: SheepCounters & { predatorTotal: number, injuredSheepTotal: number, deadSheepTotal: number } = {
    sheepCountTotal: 0,
    whiteGreySheepCount: 0,
    blackSheepCount: 0,
    brownSheepCount: 0,
    blueTieCount: 0,
    greenTieCount: 0,
    yellowTieCount: 0,
    redTieCount: 0,
    missingTieCount: 0,
    predatorTotal: 0,
    injuredSheepTotal: 0,
    deadSheepTotal: 0,
  };
  if (trip)
    for (const [key, value] of Object.entries(trip.observations)) {
      // operator overloading does not exist in javascript (or typescript) :(
      // https://stackoverflow.com/questions/19620667/javascript-operator-overloading
      // https://stackoverflow.com/questions/36110070/does-typescript-have-operator-overloading
      if (value.type === "SHEEP") {
        observationsTotal.sheepCountTotal += value.sheepCountTotal;
        observationsTotal.whiteGreySheepCount += value.whiteGreySheepCount;
        observationsTotal.blackSheepCount += value.blackSheepCount;
        observationsTotal.brownSheepCount += value.brownSheepCount;
        // tie counts are set in object initialization, hence the '!'.
        observationsTotal.blueTieCount! += value.blueTieCount ?? 0;
        observationsTotal.greenTieCount! += value.greenTieCount ?? 0;
        observationsTotal.yellowTieCount! += value.yellowTieCount ?? 0;
        observationsTotal.redTieCount! += value.redTieCount ?? 0;
        observationsTotal.missingTieCount! += value.missingTieCount ?? 0;
      }
      if (value.type === "PREDATOR") observationsTotal.predatorTotal++;
      if (value.type === "INJURED_SHEEP") observationsTotal.injuredSheepTotal++;
      if (value.type === "DEAD_SHEEP") observationsTotal.injuredSheepTotal++;
    }

  return {
    observationsTotal,
    trip,
    isUsingLocalTiles: state.isUsingLocalTiles,
  }

  // summer alle observasjonene til trippen
};

const connector = connect(mapStateToProps, { finishTrip });

type StartScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "StartScreen">

const imageSize = 70; // was 100
const margin = 10;
const ReceiptScreen = (props: StartScreenProps) => {
  // const first principle B<)
  const adjustedMapRegion: Region | undefined =
    props.trip === undefined ? undefined : {
      latitude: props.trip?.mapRegion.latitude,
      longitude: props.trip?.mapRegion.longitude,
      latitudeDelta: props.trip?.mapRegion.latitudeDelta,
      longitudeDelta: props.trip.mapRegion.longitudeDelta
    };
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <View style={{ justifyContent: "space-between", flexGrow: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: margin }}>
          <View>
            <Image
              style={{ width: imageSize, height: imageSize, resizeMode: "contain", }}
              source={require("../assets/multiple-sheep.png")}
            />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.sheepCountTotal}</Text>
          </View>
          <View>
            <Image
              style={{ width: imageSize, height: imageSize, resizeMode: "contain", }}
              source={require("../assets/sheep_1.png")}
            />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.whiteGreySheepCount}</Text>
          </View>
          <View>
            <Image
              style={{ width: imageSize, height: imageSize, resizeMode: "contain", }}
              source={require("../assets/brown-sheep.png")}
            />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.brownSheepCount}</Text>
          </View>
          <View>
            <Image
              style={{ width: imageSize, height: imageSize, resizeMode: "contain", }}
              source={require("../assets/black-sheep.png")}
            />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.blackSheepCount}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: margin }}>
          <View>
            <MaterialCommunityIcons name="tie" size={imageSize} color="#05d" />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.blueTieCount}</Text>
          </View>
          <View>
            <MaterialCommunityIcons name="tie" size={imageSize} color="#070" />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.greenTieCount}</Text>
          </View>
          <View>
            <MaterialCommunityIcons name="tie" size={imageSize} color="#f4d528" />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.yellowTieCount}</Text>
          </View>
          <View>
            <MaterialCommunityIcons name="tie" size={imageSize} color="#d22" />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.redTieCount}</Text>
          </View>
          <View style={{ justifyContent: "space-between" }}>
            <AntDesign name="close" size={60} color="black" />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.missingTieCount}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: margin }}>

          <View style={{ justifyContent: "flex-end" }}>
            <InjuredSheepIcon size={imageSize - 6} />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.injuredSheepTotal}</Text>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <DeadSheepIcon size={imageSize - 4} />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.deadSheepTotal}</Text>
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <PredatorIcon size={imageSize} />
            <Text style={{ alignSelf: "center" }}>{props.observationsTotal.predatorTotal}</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", flexGrow: 1 }}>
          <MapView
            style={{ width: "100%", flexGrow: 1 }}
            maxZoomLevel={20}
            pitchEnabled={false}
            provider="google"
            showsUserLocation={true}
            initialRegion={adjustedMapRegion}
          >
            {<UrlTile urlTemplate={props.isUsingLocalTiles
              ? tileTemplateWithPath
              : "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}"} />
            }

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