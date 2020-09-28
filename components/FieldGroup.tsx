import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect } from "react-redux";
import { ReduxState } from "../shared/TypeDefinitions";

interface FieldGroupProps {
  onPressed: () => void
}

const FieldGroup = (props: FieldGroupProps) => ( // todo: merge with field group frame?
  <FieldGroupFrame title="field group title">
    <Field description="field description" onPressed={props.onPressed}/>
    <Field description="field description" onPressed={props.onPressed}/>
    <Field description="field description" onPressed={props.onPressed}/>
    <Field description="field description" onPressed={props.onPressed}/>

  </FieldGroupFrame>
);

const mapStateToProps = (state: ReduxState, ownProps:FieldGroupProps) => {
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