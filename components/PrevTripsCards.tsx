import React, { Fragment } from 'react';
import { Callout, Marker, Polyline } from "react-native-maps";
import { SauseeState } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { View, Image, Text, Pressable, Animated, StyleSheet } from 'react-native';

const mapStateToProps = (state: SauseeState) => ({
  trips: state.trips,
});

const connector = connect(mapStateToProps);//, { setCurrentObservationID });

type PrevTripsCardsProps = ConnectedProps<typeof connector>; // & { navToFormScreen: () => void };

const PrevTripsCards = (props: PrevTripsCardsProps) => (
  // Set region to preview when a card is previewed
  // Set region back to origial when leaving card view. Maybe not this componets reponsibility.
  // Use trips as they are stored in redux. Last trip first.
  <Animated.ScrollView
    horizontal={true}
    scrollEventThrottle={1}
    pagingEnabled={true}
    showsHorizontalScrollIndicator={false}
    snapToInterval={CARD_WIDTH}
    onScroll={Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              //x: this.animation,
            },
          },
        },
      ],
      { useNativeDriver: true }
    )}
    style={styles.scrollView}
    contentContainerStyle={styles.endPadding}
  >
    {props.trips.map((trip, index) => {
      <View style={styles.card} key={index}>
        <Image
          source={require("../assets/sheep_1.png")}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardTitle}>{"sheepern"}</Text>
          <Text numberOfLines={1} style={styles.cardDescription}>
            {"description"}
          </Text>
        </View>
      </View>
    })}
  </Animated.ScrollView>
);

const CARD_WIDTH = 50;
const CARD_HEIGHT = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    top: 0, left: 0, right: 0, bottom: -25
  },
  iconContainer: {
    position: 'absolute',
    top: 60,
    right: 15,
    zIndex: 1
  },
  //--- Style for Marker -----//
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: 15,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
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
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  }
});

export default connector(PrevTripsCards);
