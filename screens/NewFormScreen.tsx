import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from 'react-redux';
import { Text, StyleSheet, View, Image, ScrollView, Button, Alert, Pressable } from 'react-native';
import { finishObservation, cancelObservation, createTrip, beginObservation, deleteObservation } from '../shared/ActionCreators';
import SegmentedControl from '@react-native-community/segmented-control';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CounterDescriptions } from '../shared/Descriptions';


// TODO: Trengs action dispatcherne? Vurder å fjerne hele connect
const connector = connect(null, { finishObservation, cancelObservation, createTrip, beginObservation, deleteObservation });

function NewFormScreen(props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "NewFormScreen">) {

  useEffect(() => {
    props.createTrip();
    props.beginObservation();
  }, []);

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

  const [isNearForm, setIsNearForm] = useState(props.route.params.initialNearForm);

  const onFieldPress = (counter: CounterName) => props.navigation.navigate("NewCounterScreen", { initialCounter: counter });
  // const onFieldPress = (counter: CounterName) => props.navigation.navigate("TestScreen");

  return (
    <ScrollView>
      <View style={styles.mainFormContainer}>

        <View style={styles.spacingTop}>
          <SegmentedControl
            values={["Nær", "Fjern"]}
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

        {/* TODO prettify this button */}
        <View style={styles.deleteButtonContainer}>
          <Button title="Slett observasjon" color="red" onPress={onDeletePress} />
        </View>

      </View>
    </ScrollView>
  );
}



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

const UnconnectedFormField = (props: ConnectedProps<typeof formFieldConnector> & FormFieldProps) =>
  <TouchableOpacity onPress={props.onPress}>
    <View style={styles.formFieldContainer}>
      <Image style={styles.formFieldIcon} source={require("../assets/icon.png")} />
      <View style={[styles.formFieldTextContainer, props.bottomDivider ? styles.borderBottomDivider : null]}>
        <Text style={styles.text}>{props.label}</Text>
        <Text style={styles.counterText}>{props.currentCount ?? 0}</Text>
      </View>
    </View>
  </TouchableOpacity>

const FormField = formFieldConnector(UnconnectedFormField);



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
    marginLeft: spacing
  },
  formFieldIcon: {
    width: 26,
    height: 26,
    marginVertical: spacing,
    marginRight: spacing
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
    marginVertical: spacing
  }
});

export default connector(NewFormScreen);
