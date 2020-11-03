import React, { useEffect, useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../shared/TypeDefinitions';
import { Text, StyleSheet, View, Animated, PanResponder, Dimensions, Easing } from 'react-native';
import { mapCurrentObservationToProps } from '../shared/Mappers';
import { connect, ConnectedProps } from 'react-redux';
import { changeCounter } from '../shared/ActionCreators';
import { AllCounters, CounterDescriptions } from '../shared/Descriptions';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const { width: screenWidth } = Dimensions.get("screen");
const halfScreenWidth = screenWidth / 2;

const mod = (n: number, m: number) => ((n % m) + m) % m;

const connector = connect(mapCurrentObservationToProps, { changeCounter });


const NewCounterScreen = (props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "NewCounterScreen">) => {

  const gestureDirectionHorizontal = useRef(false);

  const circleRadius = useRef(new Animated.Value(0)).current;
  circleRadius.setOffset(200);

  const verticalPos = useRef(new Animated.Value(0)).current;
  const horizontalPos = useRef(new Animated.Value(0)).current;

  const [currentCounterIndex, setCurrentCounterIndex] = useState(() => AllCounters.indexOf(props.route.params.initialCounter));
  const currentCounter = useRef(AllCounters[currentCounterIndex]);
  currentCounter.current = AllCounters[currentCounterIndex];

  // Update navigation title when current counter changes
  useEffect(() => {
    props.navigation.setOptions({ title: CounterDescriptions[currentCounter.current] });
  }, [currentCounterIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gs) => {
        gestureDirectionHorizontal.current = Math.abs(gs.dx) > Math.abs(gs.dy) * 2;
        return Math.max(Math.abs(gs.dx), Math.abs(gs.dy)) > 10;
      },

      onPanResponderMove: (e, gs) => {
        if (gestureDirectionHorizontal.current) {
          horizontalPos.setValue(gs.dx);
        }
        else {
          circleRadius.setValue(gs.dy * gs.dy * 0.05 * Math.sign(gs.dy));
          verticalPos.setValue(gs.dy);
        }
      },

      onPanResponderRelease: (e, gs) => {
        const vt = 0.3;
        const v = Math.sqrt(gs.vx * gs.vx + gs.vy * gs.vy) * Math.sign(gs.vx);
        console.log("Gesture velocity x", gs.vx);
        console.log("Gesture velocity y", gs.vy);
        console.log("v", v);
        console.log(".");

        if (gestureDirectionHorizontal.current) {
          if (gs.dx > halfScreenWidth || gs.vx > vt) {
            horizontalPos.setValue(-screenWidth + gs.dx);
            setCurrentCounterIndex(i => mod(i - 1, AllCounters.length));
          }
          else if (gs.dx < -halfScreenWidth || gs.vx < -vt) {
            horizontalPos.setValue(screenWidth + gs.dx);
            setCurrentCounterIndex(i => mod(i + 1, AllCounters.length));
          }
          Animated.spring(horizontalPos, { toValue: 0, useNativeDriver: false }).start();
        }
        else {
          // TODO tweak and check velocity?
          if (gs.dy > 100 || gs.vy > vt) {
            props.changeCounter(currentCounter.current, -1);
          }
          else if (gs.dy < -100 || gs.vy < -vt) {
            props.changeCounter(currentCounter.current, 1);
          }
          Animated.parallel([
            Animated.spring(circleRadius, { toValue: 0, speed: 100, useNativeDriver: false }),
            Animated.spring(verticalPos, { toValue: 0, speed: 100, useNativeDriver: false })
          ]).start();
        }
      }
    })
  ).current;

  const prevCounter = AllCounters[mod(currentCounterIndex - 1, AllCounters.length)];
  const nextCounter = AllCounters[mod(currentCounterIndex + 1, AllCounters.length)];

  return (
    <View style={[StyleSheet.absoluteFill, styles.mainContainer]} {...panResponder.panHandlers}>
      <Animated.View style={[styles.circle, {
        width: Animated.multiply(circleRadius, 2),
        height: Animated.multiply(circleRadius, 2),
        top: Animated.multiply(circleRadius, -1),
        left: Animated.add(Animated.multiply(circleRadius, -1), halfScreenWidth)
      }]}>
      </Animated.View>

      <Animated.View style={[styles.countContainer, {
        transform: [{ translateX: Animated.subtract(horizontalPos, screenWidth) }]
      }]}>
        <Text style={styles.countLabel}>{props.observation?.[prevCounter] ?? "undef"}</Text>
      </Animated.View>

      <Animated.View style={[styles.countContainer, {
        transform: [{ translateX: horizontalPos }]
      }]}>
        <Text style={styles.countLabel}>{props.observation?.[currentCounter.current] ?? "undef"}</Text>
      </Animated.View>

      <Animated.View style={[styles.countContainer, {
        transform: [{ translateX: Animated.add(horizontalPos, screenWidth) }]
      }]}>
        <Text style={styles.countLabel}>{props.observation?.[nextCounter] ?? "undef"}</Text>
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, {
        transform: [{
          translateY: verticalPos.interpolate({
            inputRange: [0, 70],
            outputRange: [0, 70],
            extrapolateLeft: "identity",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.ease)
          })
        }]
      }]}>
        <FontAwesome name="minus-circle" style={[styles.icon, styles.iconMinus]} />
      </Animated.View>

      <Animated.View style={[styles.bottomIconContainer, {
        transform: [{
          translateY: verticalPos.interpolate({
            inputRange: [-70, 120],
            outputRange: [-70, 120],
            extrapolate: "clamp"
          })
        }]
      }]}>
        <FontAwesome name="plus-circle" style={[styles.icon, styles.iconPlus]} />
        <MaterialCommunityIcons name="sheep" style={[styles.icon, styles.iconSheep]} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#5CCF68",
    overflow: "hidden"
  },
  circle: {
    position: "absolute",
    borderRadius: 2000,
    backgroundColor: "#D64C4C"
  },
  countContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  countLabel: {
    fontSize: 96
  },
  bottomIconContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -60
  },
  icon: {
    fontSize: 60,
    color: "rgba(0, 0, 0, 0.4)",
    alignSelf: "center"
  },
  iconMinus: {
    marginBottom: "auto",
    marginTop: 20,
  },
  iconPlus: {
    marginBottom: 20
  },
  iconSheep: {
  },
  border: {
    borderStyle: "dashed",
    borderWidth: 2
  }
});

export default connector(NewCounterScreen);
