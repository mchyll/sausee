import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect } from "react-redux";
import { Observation, SauseeState } from "../shared/TypeDefinitions";

interface InternalFieldGroupProps {
  observation: Observation,
  onPressed: () => void
}

interface ExternalFieldGroupProps {
  onPressed: () => void,
}

const FieldGroup = (props: InternalFieldGroupProps) => ( // todo: merge with field group frame?
  <FieldGroupFrame title="field group title">
    <Field value={props.observation.graySheepCount} description="Gray sheep" onPressed={props.onPressed}/>
    <Field value={props.observation.sheepCountTotal} description="Total sheep" onPressed={props.onPressed}/>
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