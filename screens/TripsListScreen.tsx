import { StackScreenProps, } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { connect, ConnectedComponent, ConnectedProps } from "react-redux";
import { RootStackParamList, SauseeState, Trip } from "../shared/TypeDefinitions";
import { cloneDeep } from "lodash";
import { setCurrentTripId, finishTrip  } from "../shared/ActionCreators";



const mapStateToProps = (state: SauseeState) => ({
  trips: state.trips,
});

const connector = connect(mapStateToProps, {setCurrentTripId});

type TripsListScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripsListScreen">;

const TripsListScreen = (props: TripsListScreenProps) => {

  const tripsFromProps = props.trips;
  const trips = cloneDeep(tripsFromProps);
  trips.reverse();

  const Item = ({ date, tripId }: { date: Date, tripId: string }) => (
    <View style={{ borderColor: "black", borderBottomWidth: 1, height: 70, justifyContent: "center" }}>
      {/* getMonth returnerer 1 når vi er i februar? */}
      <Button
        title={`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}\t${date.getHours()}:${date.getMinutes()}`}
        onPress={() => {
          props.setCurrentTripId(tripId);
          props.navigation.navigate("OldTripScreen");
        }} />
    </View>
  );

  const renderItem = ({ item }: { item: Trip }) => <Item date={new Date(item.timestamp)} tripId={item.id}></Item>;

  // yes, I know the ListEmptyComponent is not the prettiest 
  return <FlatList
    data={trips}
    renderItem={renderItem}
    keyExtractor={item => item.id}
    ListEmptyComponent={
    <Text style={{margin: 20, fontSize: 40}}>Tidligere turer vil vises her</Text>
  }
  >

  </FlatList>
}

export default connector(TripsListScreen);