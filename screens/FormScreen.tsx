import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { CounterName, RootStackParamList, SauseeState, Coordinates } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from 'react-redux';
import { Text, StyleSheet, View, Image, ScrollView, Button, Alert } from 'react-native';
import { finishObservation, cancelObservation, deleteObservation } from '../shared/ActionCreators';
import SegmentedControl from '@react-native-community/segmented-control';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CounterDescriptions } from '../shared/Descriptions';
import { mapCurrentObservationToProps } from '../shared/Mappers';
import { MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { createIconSet, createIconSetFromIcoMoon } from '@expo/vector-icons';
import icoMoonConfig from '../assets/icomoon/selection.json';
const Icon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'IcoMoon',
  'icomoon.ttf'
);


const connector = connect(mapCurrentObservationToProps, { finishObservation, cancelObservation, deleteObservation });

function FormScreen(props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "FormScreen">) {

  // Save the observation when leaving the screen
  useEffect(() => {
    props.navigation.addListener("beforeRemove", () => {
      console.log("Går ut av formscreen!");
      props.finishObservation();
    });
  }, [props.navigation]);

  const onDeletePress = () =>
    Alert.alert("Slett observasjon", "Er du sikker?", [
      { text: "Avbryt", style: "default" },
      {
        text: "Slett",
        style: "destructive",
        onPress: () => {
          props.deleteObservation();
          props.navigation.navigate("TripMapScreen");
        }
      }
    ]);

  let isColorNumCorrect = () => {
    const ob = props.observation;
    const whiteGrey = ob?.whiteGreySheepCount ?? 0;
    const black = ob?.blackSheepCount ?? 0;
    const brown = ob?.brownSheepCount ?? 0;
    const colorSum = whiteGrey + black + brown;
    const sheepTotal = ob?.sheepCountTotal ?? 0;
    return sheepTotal === colorSum;
  }

  let isTiesCorrect = () => {
    const ob = props.observation;
    const sheepTotal = ob?.sheepCountTotal ?? 0;
    const redTie = ob?.redTieCount ?? 0;
    const blueTie = ob?.blueTieCount ?? 0;
    const greenTie = ob?.greenTieCount ?? 0;
    const yellowTie = ob?.yellowTieCount ?? 0;
    const missingTie = ob?.missingTieCount ?? 0;
    const eweCount = redTie + blueTie + greenTie + yellowTie + missingTie;

    // blue equals 0 lambs
    // no tie is calculated the same as 0 lambs since it is unknown
    const lambCount = greenTie + yellowTie * 2 + redTie * 3;
    // console.log(lambCount);
    // console.log(eweCount);

    return sheepTotal === eweCount + lambCount;
  }

  const haversine = (p1: Coordinates, p2: Coordinates) => {
    const deg2rad = Math.PI / 180;
    const r = 6371000; // Earth radius in meters. Source: googleing "radius earth", and google showing it directly
    // Haversine formula. Source: https://en.wikipedia.org/wiki/Haversine_formula
    return 2 * r * Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(deg2rad * (p1.latitude - p2.latitude) / 2), 2)
        + Math.cos(deg2rad * p1.latitude) * Math.cos(deg2rad * p2.latitude)
        * Math.pow(Math.sin(deg2rad * (p1.longitude - p2.longitude) / 2), 2)
      )
    );
  };

  const isCloseToSheep = () => { // maybe use Vincenty's formulae istead? It takes earth's shape more into account https://en.wikipedia.org/wiki/Vincenty%27s_formulae
    const sc = props.observation?.sheepCoordinates;
    const yc = props.observation?.yourCoordinates;
    // If form-first flow is taken (sheep position is not yet set), assume sheep are far away
    if (!sc || !yc) {
      return false;
    }
    // console.log("sheep location")
    // console.log(sc);
    // console.log("your location")
    // console.log(yc);
    const distance = haversine(sc, yc);
    console.log("Distance between user and sheep: " + distance);
    return distance < 50;
  }

  const [isNearForm, setIsNearForm] = useState(() => isCloseToSheep()); //props.route.params.initialNearForm); // () => isCloseToSheep() ? 0 : 1

  const onFieldPress = (counter: CounterName) => props.navigation.navigate("CounterScreen", { initialCounter: counter, showTies: isNearForm });
  // const onFieldPress = (counter: CounterName) => props.navigation.navigate("TestScreen");

  return (
    <ScrollView>
      <View style={styles.mainFormContainer}>

        <View style={styles.spacingTop}>
          <SegmentedControl
            values={["Ser slips", "Ser ikke slips"]}
            selectedIndex={isNearForm ? 0 : 1}
            onChange={event => setIsNearForm(event.nativeEvent.selectedSegmentIndex === 0)}
          />
        </View>

        <FormGroup
          onFieldPress={onFieldPress}
          counters={[
            "sheepCountTotal"
          ]}
        />

        <FormGroup
          onFieldPress={onFieldPress}
          counters={[
            "whiteGreySheepCount",
            "brownSheepCount",
            "blackSheepCount"
          ]}
        />

        {!isColorNumCorrect() &&
          <View style={{ margin: 10 }}>
            <Text style={{ fontWeight: "bold", }}>Fargene og totalt antall samsvarer ikke.</Text>
          </View>}

        {isNearForm &&
          <FormGroup
            onFieldPress={onFieldPress}
            counters={[
              "blueTieCount",
              "greenTieCount",
              "yellowTieCount",
              "redTieCount",
              "missingTieCount"
            ]}
          />
        }

        {isNearForm && !isTiesCorrect() &&
          <View style={{ margin: 10 }}>
            <Text style={{ fontWeight: "bold", }}>Slipsfargene og totalt antall samsvarer ikke.</Text>
          </View>}

        {/* TODO prettify this button */}
        <View style={styles.deleteButtonContainer}>
          <Button title="Slett observasjon" color="red" onPress={onDeletePress} />
        </View>

      </View>
    </ScrollView>
  );
}

// todo: Say in the errormessage what the different tie colors reperesent? Or just maybe in the label on screen like: "blå slips(1)"



interface FormGroupProps {
  counters: CounterName[];
  onFieldPress: (counter: CounterName) => void;
}
const FormGroup = (props: FormGroupProps) =>
  <View style={[styles.spacingTop, styles.formGroup]}>
    {props.counters.map((counter, i) =>
      <FormField
        key={i}
        counter={counter}
        label={CounterDescriptions[counter]}
        bottomDivider={i !== props.counters.length - 1}
        onPress={() => props.onFieldPress(counter)}
      />
    )}
  </View>



interface FormFieldProps {
  counter: CounterName;
  label: string;
  bottomDivider: boolean;
  onPress: () => void;
}

const formFieldConnector = connect((state: SauseeState, ownProps: FormFieldProps) => ({
  currentCount: state.currentObservation?.[ownProps.counter]
}));

function getFieldIconComponent(counter: CounterName) {
  switch (counter) {
    case "sheepCountTotal":
      return <Image style={styles.formFieldIcon} source={require("../assets/multiple-sheep.png")} />

    case "whiteGreySheepCount":
      return <Image style={styles.formFieldIcon} source={require("../assets/sheep_1.png")} />

    case "brownSheepCount":
      return <Image style={styles.formFieldIcon} source={require("../assets/brown-sheep.png")} />

    case "blackSheepCount":
      return <Image style={styles.formFieldIcon} source={require("../assets/black-sheep.png")} />

    case "blueTieCount":
      return <MaterialCommunityIcons style={styles.formFieldIcon} name="tie" size={24} color="#05d" />

    case "greenTieCount":
      return <MaterialCommunityIcons style={styles.formFieldIcon} name="tie" size={24} color="#070" />

    case "yellowTieCount":
      return <MaterialCommunityIcons style={styles.formFieldIcon} name="tie" size={24} color="#f4d528" />

    case "redTieCount":
      return <MaterialCommunityIcons style={styles.formFieldIcon} name="tie" size={24} color="#d22" />

    case "missingTieCount":
      return <AntDesign style={styles.formFieldIcon} name="close" size={24} color="black" />

    default:
      return <Image style={styles.formFieldIcon} source={require("../assets/sheep-2.png")} />
  }
}

const UnconnectedFormField = (props: ConnectedProps<typeof formFieldConnector> & FormFieldProps) =>
  <TouchableOpacity onPress={props.onPress}>
    <View style={styles.formFieldContainer}>
      {getFieldIconComponent(props.counter)}
      {/*<Image style={styles.formFieldIcon} source={require("../assets/icon.png")} /> */}
      <View style={[styles.formFieldTextContainer, props.bottomDivider ? styles.borderBottomDivider : null]}>
        <Text style={styles.text}>{props.label}</Text>
        <Text style={styles.counterText}>{props.currentCount ?? 0}</Text>
      </View>
    </View>
  </TouchableOpacity>


const FormField = formFieldConnector(UnconnectedFormField);
//<Image style={styles.formFieldIcon} source={require("../assets/icon.png")} />




const spacing = 15;
const styles = StyleSheet.create({
  text: {
    fontSize: 17
  },
  counterText: {
    fontSize: 24
  },
  spacingTop: {
    marginTop: spacing
  },
  mainFormContainer: {
    marginHorizontal: spacing
  },
  formGroup: {
    borderRadius: 10,
    backgroundColor: "white",
    overflow: "hidden"
  },
  formFieldContainer: {
    flexDirection: "row",
    height: 26 + spacing * 2,
    marginLeft: spacing,
  },
  formFieldIcon: {
    width: 26,
    height: 26,
    marginVertical: spacing,
    marginRight: spacing,
    borderRadius: 5,
  },
  formFieldTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    paddingRight: spacing
  },
  borderBottomDivider: {
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  deleteButtonContainer: {
    //marginVertical: spacing,
    marginTop: 20,
    marginBottom: 50,
  }
});

export default connector(FormScreen);
