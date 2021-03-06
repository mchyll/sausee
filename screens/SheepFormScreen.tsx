import React, { useCallback, useRef } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SheepCounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from 'react-redux';
import { Text, StyleSheet, View, Image, ScrollView, Platform } from 'react-native';
import { finishObservation, cancelObservation, deleteObservation, setIsNearForm } from '../shared/ActionCreators';
import SegmentedControl from '@react-native-community/segmented-control';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CounterDescriptions } from '../shared/Descriptions';
import { mapCurrentSheepObservationToProps } from '../shared/Mappers';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import FormScreenFrame from './FormScreenFrame';
import { FormTypeHeader } from '../components/FormTypeHeader';


const connector = connect(mapCurrentSheepObservationToProps, { finishObservation, cancelObservation, deleteObservation, setIsNearForm });

function SheepFormScreen(props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "SheepFormScreen">) {

  const shouldFinishObservation = useRef(true);

  useFocusEffect(useCallback(() => {
    shouldFinishObservation.current = true;
  }, []));

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

  const onFieldPress = (counter: SheepCounterName) => {
    if (props.editable) {
      shouldFinishObservation.current = false;
      if (Platform.OS === "ios") {
        props.navigation.replace("CounterScreen", { initialCounter: counter });
      }
      else {
        props.navigation.push("CounterScreen", { initialCounter: counter });
      }
    }
  }

  return (
    <ScrollView>

      <FormScreenFrame navigation={props.navigation} shouldFinishObservation={shouldFinishObservation}>

        <FormTypeHeader formType="SHEEP" />

        <View style={styles.mainFormContainer}>

          <View style={styles.spacingTop}>
            <SegmentedControl
              enabled={props.editable}
              values={["Ser slips", "Ser ikke slips"]}
              selectedIndex={props.observation?.isNearForm ? 0 : 1}
              onChange={event => {
                props.setIsNearForm(event.nativeEvent.selectedSegmentIndex === 0);
              }}
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

          {props.observation?.isNearForm &&
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

          {props.observation?.isNearForm && !isTiesCorrect() &&
            <View style={{ margin: 10 }}>
              <Text style={{ fontWeight: "bold", }}>Slipsfargene og totalt antall samsvarer ikke.</Text>
            </View>}

        </View>
      </FormScreenFrame>
    </ScrollView>

  );
}

// todo: Say in the errormessage what the different tie colors reperesent? Or just maybe in the label on screen like: "blå slips(1)"



interface FormGroupProps {
  counters: SheepCounterName[];
  onFieldPress: (counter: SheepCounterName) => void;
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



function getFieldIconComponent(counter: SheepCounterName) {
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

interface FormFieldProps {
  counter: SheepCounterName;
  label: string;
  bottomDivider: boolean;
  onPress: () => void;
}

const formFieldConnector = connect((state: SauseeState, ownProps: FormFieldProps) => ({
  currentCount: state.currentObservation?.type === "SHEEP" ? state.currentObservation[ownProps.counter] : 0
}));

const FormField = formFieldConnector((props: ConnectedProps<typeof formFieldConnector> & FormFieldProps) =>
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
);



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
    marginTop: -20,
    marginHorizontal: spacing,
    marginBottom: spacing
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


export default connector(SheepFormScreen);
