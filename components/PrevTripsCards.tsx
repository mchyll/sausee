import React, { Fragment, useEffect } from 'react';
import { Callout, Marker, Polyline } from "react-native-maps";
import { SauseeState } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, Text, Pressable, Animated, StyleSheet, Platform, Dimensions } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

const mapStateToProps = (state: SauseeState) => ({
  trips: state.trips,
});

const connector = connect(mapStateToProps);//, { setCurrentObservationID });

type PrevTripsCardsProps = ConnectedProps<typeof connector>; // & { navToFormScreen: () => void };

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;



const PrevTripsCards = (props: PrevTripsCardsProps) => {

  let mapAnimation = new Animated.Value(0);
  let mapIndex = 0;

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3);
      if (index >= props.trips.length) {
        index = props.trips.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          //const { coordinate } = state.markers[index];
        }
      }, 10);
    })
  });

  return (
    // Set region to preview when a card is previewed
    // Set region back to origial when leaving card view. Maybe not this componets reponsibility.
    // Use trips as they are stored in redux. Last trip first.
    <Animated.ScrollView
      horizontal
      scrollEventThrottle={1}
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
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: mapAnimation,
              }
            }
          }
        ], 
        {useNativeDriver: true}
      )}
    >
      {props.trips.map((trip, index) => (
        <View style={styles.card} key={index}>

          <View style={styles.textContent}>
            <Text numberOfLines={1} style={styles.cardtitle}>{trip.timestamp}</Text>
            <Text numberOfLines={1} style={styles.cardDescription}>{trip.id}</Text>
          </View>
        </View>
      ))}
    </Animated.ScrollView>
  );
}

// image: style={styles.cardImage}


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: "row",
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
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
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold'
  }
})
export default connector(PrevTripsCards);
