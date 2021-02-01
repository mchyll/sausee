import React, { useEffect, useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../shared/TypeDefinitions';
import { Text, StyleSheet, View, Animated, PanResponder, Dimensions, Easing } from 'react-native';
import { mapCurrentObservationToProps } from '../shared/Mappers';
import { connect, ConnectedProps } from 'react-redux';
import { changeCounter } from '../shared/ActionCreators';
import { AllCounters, CounterDescriptions, getCounterSpeechDescription, NoTiesCounters } from '../shared/Descriptions';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';


const { width: screenWidth } = Dimensions.get("screen");
const halfScreenWidth = screenWidth / 2;

const mod = (n: number, m: number) => ((n % m) + m) % m;

const circleInterpolation: Animated.InterpolationConfigType = {
  inputRange: [0, 1],
  outputRange: [200, 201],
  easing: n => 0.05 * n * n * Math.sign(n)
};

const speak = (...sentences: string[]) => {
  Speech.stop();
  for (const sentence of sentences) {
    Speech.speak(sentence, { rate: 1.1 });
  }
};

const connector = connect(mapCurrentObservationToProps, { changeCounter });


const CounterScreen = (props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "CounterScreen">) => {

  type GestureVariant = "HORIZONTAL_SWIPE" | "VERTICAL_SWIPE" | "TOUCH";
  const currentGesture = useRef<GestureVariant>("TOUCH");

  const verticalPos = useRef(new Animated.Value(0)).current;
  const horizontalPos = useRef(new Animated.Value(0)).current;

  const availableCounters = props.route.params.showTies ? AllCounters : NoTiesCounters;
  const [currentCounterIndex, setCurrentCounterIndex] = useState(() => availableCounters.indexOf(props.route.params.initialCounter));
  const currentCounter = useRef(availableCounters[currentCounterIndex]);
  currentCounter.current = availableCounters[currentCounterIndex];
  const currentCount = useRef(0);
  currentCount.current = props.observation?.[currentCounter.current] ?? 0;

  // Update navigation title and speak when current counter changes
  useEffect(() => {
    props.navigation.setOptions({ title: CounterDescriptions[currentCounter.current] });
    speak(CounterDescriptions[currentCounter.current]);
  }, [currentCounterIndex]);

  // Swaying animation on counter number as a visual cue for the possibility of swiping sideways
  // This animation will be stopped at once the user swipes horizontally (by horizontalPos.setValue)
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(horizontalPos, { toValue: -20, useNativeDriver: false, duration: 0 }),
      Animated.timing(horizontalPos, { toValue: 20, useNativeDriver: false }),
      Animated.timing(horizontalPos, { toValue: -20, useNativeDriver: false }),
    ])).start();
  }, []);

  const changeCurrentCounter = (change: number) => {
    props.changeCounter(currentCounter.current, change);
    const newCount = Math.max(0, currentCount.current + change);
    speak(String(newCount), getCounterSpeechDescription(currentCounter.current, newCount));
  };
  const incrementCurrentCounter = () => changeCurrentCounter(1);
  const decrementCurrentCounter = () => changeCurrentCounter(-1);

  const panResponder = useRef(
    PanResponder.create({

      onStartShouldSetPanResponder: () => {
        currentGesture.current = "TOUCH";
        return true;
      },

      onPanResponderMove: (e, gs) => {
        if (currentGesture.current === "TOUCH" && Math.max(Math.abs(gs.dx), Math.abs(gs.dy)) > 10) {
          if (Math.abs(gs.dx) > Math.abs(gs.dy) * 2) {
            currentGesture.current = "HORIZONTAL_SWIPE";
          } else {
            currentGesture.current = "VERTICAL_SWIPE";
          }
        }

        if (currentGesture.current === "HORIZONTAL_SWIPE") {
          horizontalPos.setValue(gs.dx);
        }
        else if (currentGesture.current === "VERTICAL_SWIPE") {
          verticalPos.setValue(gs.dy);
        }
      },

      onPanResponderRelease: (e, gs) => {
        console.log("Congrats! You just did a " + currentGesture.current);

        const vt = 0.3;
        const v = Math.sqrt(gs.vx * gs.vx + gs.vy * gs.vy) * Math.sign(gs.vx);
        console.log(`Gesture velocity:   x = ${gs.vx.toFixed(4)}   y = ${gs.vy.toFixed(4)}   v = ${v.toFixed(4)}`);

        if (currentGesture.current === "HORIZONTAL_SWIPE") {
          if (gs.dx > halfScreenWidth || gs.vx > vt) {
            horizontalPos.setValue(-screenWidth + gs.dx);
            setCurrentCounterIndex(i => mod(i - 1, availableCounters.length));
          }
          else if (gs.dx < -halfScreenWidth || gs.vx < -vt) {
            horizontalPos.setValue(screenWidth + gs.dx);
            setCurrentCounterIndex(i => mod(i + 1, availableCounters.length));
          }
          Animated.spring(horizontalPos, { toValue: 0, useNativeDriver: false }).start();
        }

        else if (currentGesture.current === "VERTICAL_SWIPE") {
          if (gs.dy > 100 || gs.vy > vt) {
            decrementCurrentCounter();
          }
          else if (gs.dy < -100 || gs.vy < -vt) {
            incrementCurrentCounter();
          }
          Animated.spring(verticalPos, { toValue: 0, speed: 100, useNativeDriver: false }).start();
        }

        else {
          const x = e.nativeEvent.locationX;
          const y = e.nativeEvent.locationY;
          const dsq = (x - halfScreenWidth) ** 2 + y * y;
          console.log(`Pressed at x = ${x}   y = ${y}   dsq = ${dsq}`);

          if (dsq <= 40000) {
            decrementCurrentCounter();
            Animated.sequence([
              Animated.timing(verticalPos, { toValue: 100, duration: 200, useNativeDriver: false }),
              Animated.timing(verticalPos, { toValue: 0, duration: 100, useNativeDriver: false })
            ]).start();
          }
          else {
            incrementCurrentCounter();
            Animated.sequence([
              Animated.timing(verticalPos, { toValue: -100, duration: 200, useNativeDriver: false }),
              Animated.timing(verticalPos, { toValue: 0, duration: 100, useNativeDriver: false })
            ]).start();
          }
        }
      }
    })
  ).current;

  const prevCounter = availableCounters[mod(currentCounterIndex - 1, availableCounters.length)];
  const nextCounter = availableCounters[mod(currentCounterIndex + 1, availableCounters.length)];

  const circleRadius = verticalPos.interpolate(circleInterpolation);
  const circleDia = Animated.multiply(circleRadius, 2);
  const circlePos = Animated.multiply(circleRadius, -1);

  const AnimatedSheepIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

  return (
    <View style={[StyleSheet.absoluteFill, styles.mainContainer]} {...panResponder.panHandlers}>

      {/* RED CIRCLE SEGMENT */}
      <Animated.View pointerEvents="none" style={[styles.circle, {
        width: circleDia,
        height: circleDia,
        top: circlePos,
        left: Animated.add(circlePos, halfScreenWidth)
      }]}>
      </Animated.View>


      {/* COUNTERS */}
      <Animated.View pointerEvents="none" style={[styles.countContainer, {
        transform: [{ translateX: Animated.subtract(horizontalPos, screenWidth) }]
      }]}>
        <Text style={styles.countLabel}>{props.observation?.[prevCounter] ?? 0}</Text>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.countContainer, {
        transform: [{ translateX: horizontalPos }]
      }]}>
        <Text style={styles.countLabel}>{currentCount.current}</Text>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.countContainer, {
        transform: [{ translateX: Animated.add(horizontalPos, screenWidth) }]
      }]}>
        <Text style={styles.countLabel}>{props.observation?.[nextCounter] ?? 0}</Text>
      </Animated.View>


      {/* MINUS SIGN */}
      <Animated.View pointerEvents="none" style={[styles.iconContainer, {
        top: 0,
        transform: [{
          translateY: verticalPos.interpolate({
            inputRange: [0, 70],
            outputRange: [0, 70],
            extrapolateRight: "clamp"
          })
        }]
      }]}>
        <FontAwesome name="minus-circle" style={[styles.icon, styles.iconMinus]} />
      </Animated.View>


      {/* PLUS SIGN AND SHEEP ICON */}
      <Animated.View pointerEvents="none" style={[styles.iconContainer, {
        bottom: 0,
        transform: [{
          translateY: Animated.add(60,
            verticalPos.interpolate({
              inputRange: [-150, 0],
              outputRange: [-150, 0],
              extrapolateLeft: "clamp"
            }))
        }]
      }]}>
        <FontAwesome name="plus-circle" style={[styles.icon, styles.iconPlus]} />
        <AnimatedSheepIcon name="sheep" style={[styles.icon, {
          fontSize: verticalPos.interpolate({
            inputRange: [-150, -50],
            outputRange: [300, 60],
            extrapolate: "clamp"
          })
        }]} />
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
    backgroundColor: "#D64C4C",
    overflow: "hidden"
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
  iconContainer: {
    position: "absolute",
    left: 0,
    right: 0
  },
  icon: {
    fontSize: 60,
    color: "rgba(0, 0, 0, 0.3)",
    alignSelf: "center"
  },
  iconMinus: {
    marginTop: 20
  },
  iconPlus: {
    marginBottom: 20
  },
  highlight: {
    borderStyle: "dashed",
    borderWidth: 2,
    backgroundColor: "rgba(0, 0, 255, 0.3)"
  }
});

export default connector(CounterScreen);
