import React, { PropsWithChildren, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { CounterName, RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { connect, ConnectedProps } from 'react-redux';
import { Text, StyleSheet, View, Image, ScrollView, Button, Alert } from 'react-native';
import { finishObservation, cancelObservation } from '../shared/ActionCreators';
import { mapCurrentObservationToProps } from '../shared/Mappers';
import SegmentedControl from '@react-native-community/segmented-control';


const onDeletePress = () =>
  Alert.alert("Slett observasjon", "Er du sikker?", [
    { text: "Avbryt", style: "default" },
    { text: "Slett", style: "destructive", onPress: () => { } }
  ]);

const connector = connect(mapCurrentObservationToProps, { finishObservation, cancelObservation });

function NewFormScreen(props: ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "NewFormScreen">) {

  const [isNearForm, setIsNearForm] = useState(props.route.params.initialNearForm);

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

        <FormGroup>
          <FormField label="Antall sauer totalt" counter="sheepCountTotal" />
        </FormGroup>

        <FormGroup>
          <FormField label="Hvitgrå sauer" counter="whiteGreySheepCount" />
          <FormField label="Brune sauer" counter="brownSheepCount" />
          <FormField label="Svarte sauer" counter="blackSheepCount" />
          <FormField label="Svarte sauer" counter="blackSheepCount" />
          <FormField label="Svarte sauer" counter="blackSheepCount" />
        </FormGroup>

        {isNearForm &&
          <FormGroup>
            <FormField label="Blå slips" counter="blueTieCount" />
            <FormField label="Grønne slips" counter="greenTieCount" />
            <FormField label="Gule slips" counter="yellowTieCount" />
            <FormField label="Røde slips" counter="redTieCount" />
            <FormField label="Manglende slips" counter="missingTieCount" />
          </FormGroup>
        }

        <View style={styles.deleteButtonContainer}>
          <Button title="Slett observasjon" color="red" onPress={onDeletePress} />
        </View>

      </View>
    </ScrollView>
  )
}

const FormGroup = (props: PropsWithChildren<{}>) => {
  const lastChildIndex = React.Children.count(props.children) - 1;
  return (
    <View style={[styles.spacingTop, styles.formGroup]}>
      {React.Children.map(props.children, (child, i) =>
        React.isValidElement<FormFieldProps>(child) ?
          React.cloneElement(child, {
            bottomDivider: i !== lastChildIndex
          })
          : null
      )}
    </View>
  )
}



interface FormFieldProps {
  counter: CounterName,
  label: string,
  bottomDivider?: boolean
}

const formFieldConnector = connect((state: SauseeState, ownProps: FormFieldProps) => ({
  currentCount: state.currentObservation?.[ownProps.counter]
}));

const UnconnectedFormField = (props: ConnectedProps<typeof formFieldConnector> & FormFieldProps) =>
  <View style={{ flexDirection: "row" }}>
    <Image style={{ width: 26, height: 26, margin: 15 }} source={require("../assets/icon.png")} />
    <View style={[styles.formFieldContainer, props.bottomDivider ? styles.borderBottomDivider : {}]}>
      <Text style={styles.text}>{props.label}</Text>
      <Text style={styles.counterText}>{props.currentCount ?? 0}</Text>
    </View>
  </View>

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
    backgroundColor: "white"
  },
  formFieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    paddingRight: 15
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
