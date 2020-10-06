import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect } from "react-redux";
import { CounterName, Observation, SauseeState } from "../shared/TypeDefinitions";
import { observationKtsn } from "../key_to_speech_name/ObservationKtsn";

interface InternalTotalFieldGroupProps extends ExternalTotalFieldGroupProps {
  observation: Observation,
}

interface ExternalTotalFieldGroupProps {
  onPressed: () => void,
  title: string,
  fields: CounterName[],
}

const TotalFieldGroup = (props: InternalTotalFieldGroupProps) => ( // todo: merge with field group frame?
  <FieldGroupFrame title={props.title}>
    {props.fields.map(field => <Field key={field} value={props.observation[field]} description={observationKtsn[field]} onPressed={props.onPressed}></Field>)}
    
  </FieldGroupFrame>
);

const mapStateToProps = (state: SauseeState, ownProps:ExternalTotalFieldGroupProps) => {
  let trip = state.trips.find(trip => trip.id === state.currentTrip);
  if(trip === undefined) throw new Error;

  let observation = trip.observations.find(obs => obs.id == state.currentObservation);

  if(observation === undefined) throw new Error;


  return {
    ...ownProps,
    observation: observation
  }
}

export default connect(mapStateToProps)(TotalFieldGroup);

// hardcode component?
// in that case no external props is needed?
// row with three columns. Third column has three components.