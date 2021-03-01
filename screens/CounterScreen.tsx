import React, { useEffect, useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SheepCounterName, RootStackParamList } from '../shared/TypeDefinitions';
import { Text, StyleSheet, View, Animated, PanResponder, Dimensions } from 'react-native';
import { mapCurrentSheepObservationToProps } from '../shared/Mappers';
import { connect, ConnectedProps } from 'react-redux';
import { changeCounter } from '../shared/ActionCreators';
import { AllCounters, CounterDescriptions, getCounterSpeechDescription, NoTiesCounters } from '../shared/Descriptions';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import Svg, { Circle } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
const halfScreenWidth = Math.min(screenWidth, screenHeight) / 2;
const circleRadiusBasis = halfScreenWidth;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const mod = (n: number, m: number) => ((n % m) + m) % m;

const speak = (...sentences: string[]) => {
  Speech.stop();
  for (const sentence of sentences) {
    Speech.speak(sentence, { rate: 1.1, });
  }
};

const connector = connect(mapCurrentSheepObservationToProps, { changeCounter });


const CounterScreen = (props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "CounterScreen">) => {

  type GestureVariant = "HORIZONTAL_SWIPE" | "VERTICAL_SWIPE" | "TOUCH";
  const currentGesture = useRef<GestureVariant>("TOUCH");

  const verticalSwipePos = useRef(new Animated.Value(0)).current;
  const horizontalSwipePos = useRef(new Animated.Value(0)).current;

  const availableCounters = props.observation?.isNearForm ? AllCounters : NoTiesCounters;
  const [currentCounterIndex, setCurrentCounterIndex] = useState(() => availableCounters.indexOf(props.route.params.initialCounter));
  const currentCounter = useRef(availableCounters[currentCounterIndex]);
  currentCounter.current = availableCounters[currentCounterIndex];
  const currentCount = useRef(0);
  currentCount.current = props.observation?.[currentCounter.current] ?? 0;

  // Update navigation title and speak when current counter changes
  useEffect(() => {
    props.navigation.setOptions({ title: CounterDescriptions[currentCounter.current] });
    speak(CounterDescriptions[currentCounter.current])
  }, [currentCounterIndex]);

  useEffect(() => {
    const theInterval = setInterval(() => { speak(CounterDescriptions[currentCounter.current]) }, 9000);
    return () => {
      clearInterval(theInterval);
    }
  }, [currentCounterIndex, currentCount.current]);

  const horizontalHintAnimation = useRef<Animated.CompositeAnimation>();
  const verticalHintAnimation = useRef<Animated.CompositeAnimation>();
  const verticalHint = useRef(new Animated.Value(0)).current;
  const verticalPos = Animated.add(verticalSwipePos, verticalHint);

  // Swaying animation on counter number as a visual cue for the possibility of swiping sideways
  // This animation will be stopped at once the user swipes horizontally
  useEffect(() => {
    horizontalHintAnimation.current = Animated.loop(Animated.sequence([
      Animated.delay(1000),
      Animated.timing(horizontalSwipePos, { toValue: -20, useNativeDriver: false, duration: 250 }),
      Animated.timing(horizontalSwipePos, { toValue: 20, useNativeDriver: false }),
      Animated.timing(horizontalSwipePos, { toValue: 0, useNativeDriver: false, duration: 250 }),
      Animated.delay(1000)
    ]));
    horizontalHintAnimation.current.start();
  }, []);

  // Swaying animation on plus/minus signs as a visual cue for the possibility of swiping vertically
  // This animation will be stopped at once the user swipes vertically
  useEffect(() => {
    verticalHintAnimation.current = Animated.loop(Animated.sequence([
      Animated.delay(2000),
      Animated.timing(verticalHint, { toValue: 20, useNativeDriver: false, duration: 250 }),
      Animated.timing(verticalHint, { toValue: -20, useNativeDriver: false }),
      Animated.timing(verticalHint, { toValue: 0, useNativeDriver: false, duration: 250 }),
    ]));
    verticalHintAnimation.current.start();
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
          horizontalSwipePos.setValue(gs.dx);
        }
        else if (currentGesture.current === "VERTICAL_SWIPE") {
          verticalSwipePos.setValue(gs.dy);
        }
      },

      onPanResponderRelease: (e, gs) => {
        console.log("Congrats! You just did a " + currentGesture.current);

        const vt = 0.3;
        const v = Math.sqrt(gs.vx * gs.vx + gs.vy * gs.vy) * Math.sign(gs.vx);
        console.log(`Gesture velocity:   x = ${gs.vx.toFixed(4)}   y = ${gs.vy.toFixed(4)}   v = ${v.toFixed(4)}`);

        if (currentGesture.current === "HORIZONTAL_SWIPE") {
          if (gs.dx > halfScreenWidth || gs.vx > vt) {
            horizontalSwipePos.setValue(-screenWidth + gs.dx);
            setCurrentCounterIndex(i => mod(i - 1, availableCounters.length));
          }
          else if (gs.dx < -halfScreenWidth || gs.vx < -vt) {
            horizontalSwipePos.setValue(screenWidth + gs.dx);
            setCurrentCounterIndex(i => mod(i + 1, availableCounters.length));
          }
          horizontalHintAnimation.current?.stop();
          Animated.spring(horizontalSwipePos, { toValue: 0, useNativeDriver: false }).start();
        }

        else if (currentGesture.current === "VERTICAL_SWIPE") {
          if (gs.dy > 100 || gs.vy > vt) {
            decrementCurrentCounter();
          }
          else if (gs.dy < -100 || gs.vy < -vt) {
            incrementCurrentCounter();
          }
          verticalHintAnimation.current?.reset();
          Animated.spring(verticalSwipePos, { toValue: 0, speed: 100, useNativeDriver: false, delay: 200 }).start();
        }

        else {
          const x = e.nativeEvent.locationX;
          const y = e.nativeEvent.locationY;
          const dsq = (x - halfScreenWidth) ** 2 + y * y;
          console.log(`Pressed at x = ${x}   y = ${y}   dsq = ${dsq}`);

          if (dsq <= circleRadiusBasis * circleRadiusBasis) {
            decrementCurrentCounter();
            Animated.sequence([
              Animated.timing(verticalSwipePos, { toValue: 100, duration: 200, useNativeDriver: false }),
              Animated.timing(verticalSwipePos, { toValue: 0, duration: 100, useNativeDriver: false })
            ]).start();
          }
          else {
            incrementCurrentCounter();
            Animated.sequence([
              Animated.timing(verticalSwipePos, { toValue: -100, duration: 200, useNativeDriver: false }),
              Animated.timing(verticalSwipePos, { toValue: 0, duration: 100, useNativeDriver: false, delay: 200 })
            ]).start();
          }
        }
      }
    })
  ).current;

  function getIconComponent(counter: SheepCounterName) {
    const imageHeight = 100;
    const iconSize = 90;

    switch (counter) {
      case "sheepCountTotal":
        return <Animated.Image style={{
          resizeMode: "contain",
          alignSelf: "center",
          height: imageHeight /*verticalPos.interpolate({
            inputRange: [-50, -25],
            outputRange: [200, 100],
            extrapolate: "clamp"
          }),*/
        }}
          source={require("../assets/multiple-sheep.png")}
        />

      case "whiteGreySheepCount":
        return <Animated.Image style={{
          resizeMode: "contain",
          alignSelf: "center",
          height: imageHeight /*verticalPos.interpolate({
            inputRange: [-50, -25],
            outputRange: [200, 100],
            extrapolate: "clamp"
          }),*/
        }}
          source={require("../assets/sheep_1.png")} />

      case "brownSheepCount":
        return <Animated.Image style={{
          resizeMode: "contain",
          alignSelf: "center",
          height: imageHeight /*verticalPos.interpolate({
            inputRange: [-50, -25],
            outputRange: [200, 100],
            extrapolate: "clamp"
          }),*/
        }}
          source={require("../assets/brown-sheep.png")} />

      case "blackSheepCount":
        return <Animated.Image style={{
          resizeMode: "contain",
          alignSelf: "center",
          height: imageHeight /*verticalPos.interpolate({
            inputRange: [-50, -25],
            outputRange: [200, 100],
            extrapolate: "clamp"
          }),*/
        }}
          source={require("../assets/black-sheep.png")} />

      case "blueTieCount":
        const AnimatedBlueTie = Animated.createAnimatedComponent(MaterialCommunityIcons);

        return <AnimatedBlueTie style={{
          //resizeMode: "contain",
          alignSelf: "center",
        }}
          name="tie" size={iconSize} color="#05d" />

      case "greenTieCount":
        const AnimatedGreenTie = Animated.createAnimatedComponent(MaterialCommunityIcons);

        return <AnimatedGreenTie style={{
          //resizeMode: "contain",
          alignSelf: "center",
        }}
          name="tie" size={iconSize} color="#070" />

      case "yellowTieCount":
        const AnimatedYellowTie = Animated.createAnimatedComponent(MaterialCommunityIcons);

        return <AnimatedYellowTie style={{
          //resizeMode: "contain",
          alignSelf: "center",
        }}
          name="tie" size={iconSize} color="#f4d528" />

      case "redTieCount":
        const AnimatedRedTie = Animated.createAnimatedComponent(MaterialCommunityIcons);

        return <AnimatedRedTie style={{
          //resizeMode: "contain",
          alignSelf: "center",
        }}
          name="tie" size={iconSize} color="#d22" />

      case "missingTieCount":
        const AnimatedMissingTie = Animated.createAnimatedComponent(AntDesign);

        return <AnimatedMissingTie style={{
          //resizeMode: "contain",
          alignSelf: "center",
        }}
          name="close" size={80} color="black" />

      default:
        return <Animated.Image style={{
          resizeMode: "contain",
          alignSelf: "center",
        }}
          source={require("../assets/sheep-2.png")} />
    }
  }

  const prevCounter = availableCounters[mod(currentCounterIndex - 1, availableCounters.length)];
  const nextCounter = availableCounters[mod(currentCounterIndex + 1, availableCounters.length)];

  // Radius er lik circleRadiusBasis pluss swipedistanse
  const circleRadius = Animated.add(
    circleRadiusBasis,
    // Swipedistanse er lik fingerens swipedistanse pluss swipehintet
    Animated.add(
      verticalHint,
      // Interpoler slik at sirkelen vokser raskere jo større den er
      verticalSwipePos.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        easing: n => 0.05 * n * n * Math.sign(n)
      })
    ))
    // Clamp radiusen til å aldri være mindre enn 0
    .interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolateLeft: "clamp"
    });

  return (
    <View style={[StyleSheet.absoluteFill, styles.mainContainer]} {...panResponder.panHandlers}>

      {/* RED CIRCLE SEGMENT */}
      <Svg width={screenWidth} height={screenHeight}>
        <AnimatedCircle cx={halfScreenWidth} r={circleRadius} fill="#D64C4C" />
      </Svg>


      {/* COUNTERS */}
      <Animated.View pointerEvents="none" style={[styles.countContainer, {
        transform: [{ translateX: Animated.subtract(horizontalSwipePos, screenWidth) }]
      }]}>
        <Text style={styles.countLabel}>{props.observation?.[prevCounter] ?? 0}</Text>
        {getIconComponent(prevCounter)}
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.countContainer, {
        transform: [{ translateX: horizontalSwipePos }]
      }]}>
        <Text style={styles.countLabel}>{currentCount.current}</Text>
        {getIconComponent(currentCounter.current)}
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.countContainer, {
        transform: [{ translateX: Animated.add(horizontalSwipePos, screenWidth) }]
      }]}>
        <Text style={styles.countLabel}>{props.observation?.[nextCounter] ?? 0}</Text>
        {getIconComponent(nextCounter)}
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


      {/* PLUS SIGN */}
      <Animated.View pointerEvents="none" style={[styles.iconContainer, {
        bottom: 0,
        transform: [{
          translateY: verticalPos.interpolate({
            inputRange: [-100, 0],
            outputRange: [-100, 0],
            extrapolateLeft: "clamp"
          })
        }]
      }]}>
        <FontAwesome name="plus-circle" style={[styles.icon, styles.iconPlus]} />
        {/*<AnimatedSheepIcon name="sheep" style={[styles.icon, {
          fontSize: verticalPos.interpolate({
            inputRange: [-150, -50],
            outputRange: [300, 60],
            extrapolate: "clamp"
          })
        }]} />*/}

      </Animated.View>

    </View>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#5CCF68",
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
