import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect } from "react-redux";
import { CounterName, Observation, SauseeState } from "../shared/TypeDefinitions";

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
    {props.fields.map(field => <Field key={field} value={props.observation[field]} description={field} onPressed={props.onPressed}></Field>)}
    
  </FieldGroupFrame>
);

const mapStateToProps = (state: SauseeState, ownProps:ExternalFieldGroupProps) => {
  let trip = state.trips.find(trip => trip.id === state.currentTripId);
  if (trip === undefined) throw new Error("Tried to mount component when currentTrip was undefined");

  let observation = trip?.observations.find(obs => obs.id == state.currentObservationId);

  if (observation === undefined) throw new Error("Tried to mount component when currentObservation was undefined");


  return {
    ...ownProps,
    observation: observation
  }
}

export default connect(mapStateToProps)(FieldGroup);