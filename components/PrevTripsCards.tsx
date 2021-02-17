import React, { useEffect, useRef } from 'react';
import { SauseeState, Trip } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { View, Text, Pressable, Animated, StyleSheet, Platform, Dimensions, ScrollView } from 'react-native';
import { setTripOverlayIndex } from "../shared/ActionCreators";


const mapStateToProps = (state: SauseeState) => ({
  trips: state.trips,
  currentTripId: state.currentTripId,
});

const connector = connect(mapStateToProps, {setTripOverlayIndex});//, { setCurrentObservationID });

type PrevTripsCardsProps = ConnectedProps<typeof connector> & {
  hideThisComponent: () => void,
};

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;



const PrevTripsCards = (props: PrevTripsCardsProps) => {


  if (props.trips.length == 1) {
    return (
      <View style={{ alignItems: "center", position: "absolute", right: 40, left: 40, bottom: 50, backgroundColor: "white", borderRadius: 10, padding: 10 }}>
        <Text style={{ fontSize: 40 }}>
          Tidligere turer vil vises her.
        </Text>
      </View>

    );
  }

  const padNumber = (number: number) : string => number < 10 ? `0${number}` : number.toString();

  return (
    // Set region to preview when a card is previewed
    // Set region back to origial when leaving card view. Maybe not this componets reponsibility.
    // Use trips as they are stored in redux. Last trip first.
    <ScrollView
      horizontal
      scrollEventThrottle={1}
      disableIntervalMomentum={true}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      pagingEnabled={true}
      snapToInterval={CARD_WIDTH + 20}
      snapToAlignment={"center"}
      contentInset={{ // ios only
        top: 0,
        left: SPACING_FOR_CARD_INSET,
        bottom: 0,
        right: SPACING_FOR_CARD_INSET,
      }}
      contentContainerStyle={{ // for android
        paddingHorizontal: Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
      }}
      onScroll= {(event)=> {
        let index = Math.floor(event.nativeEvent.contentOffset.x / CARD_WIDTH + 0.3);
        if (index >= props.trips.length) {
          index = props.trips.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
        props.setTripOverlayIndex(index);
      }}
    >
      {props.trips.map((trip, index) => {
        if (trip.id !== props.currentTripId) {
          const date = new Date(trip.timestamp);
          
          return (
            <View style={styles.card} key={index}>
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{`${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()} - ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`}</Text>
                <Pressable onPress={() => { props.hideThisComponent() }}>
                  <View style={{ backgroundColor: "lightblue", alignItems: "center", justifyContent: "center", borderRadius: 10, height: 60 }}>
                    <Text style={{ fontSize: 20 }}>Denne turen i bakgrunnen</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          );
        }
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 27,
    alignSelf: "center",
    fontWeight: "bold",
    margin: 10,
    //marginTop: 20,
  },
})
export default connector(PrevTripsCards);
