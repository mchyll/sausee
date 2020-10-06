import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect, ConnectedProps } from "react-redux";
import { CounterName, Observation, SauseeState } from "../shared/TypeDefinitions";
import { observationKtsn } from "../key_to_speech_name/ObservationKtsn";
import { Text, View } from "react-native";

interface ExternalTotalFieldGroupProps {
  onPressed: () => void,
}

const mapStateToProps = (state: SauseeState) => { // todo: this function is also in form screen. Write it only one place?
  let trip = state.trips.find(trip => trip.id === state.currentTripId);
  if(trip === undefined) throw new Error;

  let observation = trip.observations.find(obs => obs.id == state.currentObservationId);

  if(observation === undefined) throw new Error;


  return { observation }
}

const connector = connect(mapStateToProps);

type TotalFieldGroupProps = ConnectedProps<typeof connector> & ExternalTotalFieldGroupProps;

// todo: onpressed is kind of wierd here is that it the component is hard coded. Maybe rewrite the function to take in key istead of index?
const TotalFieldGroup = (props: TotalFieldGroupProps) => ( // todo: merge with field group frame?
  <FieldGroupFrame title="Totalt">
    <Field value={props.observation["sheepCountTotal"]} description={observationKtsn["sheepCountTotal"]} onPressed={props.onPressed}></Field>
    <Text style={{fontSize:40}}>=</Text>
    <View style={{alignItems:"center"}}>
      <Field value={props.observation["eweCount"]} description={observationKtsn["eweCount"]} onPressed={props.onPressed}></Field>
      <Text style={{fontSize:30}}>+</Text>
      <Field value={props.observation["lambCount"]} description={observationKtsn["lambCount"]} onPressed={props.onPressed}></Field>
    </View>    
  </FieldGroupFrame>
);

// {props.fields.map(field => <Field key={field} value={props.observation[field]} description={observationKtsn[field]} onPressed={props.onPressed}></Field>)}

export default connector(TotalFieldGroup);

// hardcode component?
// in that case no external props is needed?
// row with three columns. Third column has three components.