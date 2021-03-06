import { StackScreenProps, } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { connect, ConnectedComponent, ConnectedProps } from "react-redux";
import { RootStackParamList, SauseeState, Trip } from "../shared/TypeDefinitions";
import { cloneDeep } from "lodash";
import { setCurrentTripId, finishTrip } from "../shared/ActionCreators";
import { Button as MaterialButton } from 'react-native-paper';



const mapStateToProps = (state: SauseeState) => ({
  trips: state.trips,
});

const connector = connect(mapStateToProps, { setCurrentTripId });

type TripsListScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripsListScreen">;

const TripsListScreen = (props: TripsListScreenProps) => {

  const tripsFromProps = props.trips;
  const trips = cloneDeep(tripsFromProps);
  trips.reverse();

  const padNumber = (number: number): string => number < 10 ? `0${number}` : number.toString();

  const Item = ({ date, tripId }: { date: Date, tripId: string }) => {
    const dateTimeString = `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()} - ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
    return (
      <View style={{ borderColor: "black", borderBottomWidth: 1, height: 70, justifyContent: "center" }}>
        {/* getMonth returnerer 1 når vi er i februar? */}
        {Platform.OS === "ios" ?
          <Button
            title={dateTimeString}
            onPress={() => {
              props.setCurrentTripId(tripId);
              props.navigation.navigate("OldTripScreen");
            }} /> :
          //@ts-ignore
          <MaterialButton
            color="#007AFF"
            style={{ flexGrow: 1, justifyContent: "center" }}
            onPress={() => {
              props.setCurrentTripId(tripId);
              props.navigation.navigate("OldTripScreen");
            }}
          >
            {dateTimeString}
          </MaterialButton>
        }

      </View>
    );
  }

  const renderItem = ({ item }: { item: Trip }) => <Item date={new Date(item.timestamp)} tripId={item.id}></Item>;

  // yes, I know the ListEmptyComponent is not the prettiest 
  return <FlatList
    data={trips}
    renderItem={renderItem}
    keyExtractor={item => item.id}
    ListEmptyComponent={
      <Text style={{ margin: 20, fontSize: 40 }}>Tidligere turer vil vises her</Text>
    }
  >

  </FlatList>
}

export default connector(TripsListScreen);