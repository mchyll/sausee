import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect } from "react-redux";
import { CounterName, Observation, SauseeState } from "../shared/TypeDefinitions";
import { observationKtsn } from "../key_to_speech_name/ObservationKtsn";

interface InternalFieldGroupProps extends ExternalFieldGroupProps {
  observation: Observation,
}

interface ExternalFieldGroupProps {
  onPressed: () => void,
  title: string,
  fields: CounterName[],
}

const FieldGroup = (props: InternalFieldGroupProps) => ( // todo: merge with field group frame?
  <FieldGroupFrame title={props.title}>
    {props.fields.map(field => <Field key={field} value={props.observation[field]} description={observationKtsn[field]} onPressed={props.onPressed}></Field>)}
    
  </FieldGroupFrame>
);

const mapStateToProps = (state: SauseeState, ownProps:ExternalFieldGroupProps) => {
  let trip = state.trips.find(trip => trip.id === state.currentTrip);
  if(trip === undefined) throw new Error;

  let observation = trip.observations.find(obs => obs.id == state.currentObservation);

  if(observation === undefined) throw new Error;


  return {
    ...ownProps,
    observation: observation
  }
}

export default connect(mapStateToProps)(FieldGroup);