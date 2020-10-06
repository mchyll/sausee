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
  onPressed: (initCounterIndex: number, counterNames: CounterName[]) => void,
  title: string,
  fields: CounterName[],
}

const FieldGroup = (props: InternalFieldGroupProps) => {

  const navigate = (i:number) => props.onPressed(i, props.fields);

  return (
    <FieldGroupFrame title={props.title}>
      {props.fields.map((field, i) => <Field key={field} value={props.observation[field]} description={observationKtsn[field]} onPressed={() => navigate(i)}></Field>)}

    </FieldGroupFrame>
  );
}

const mapStateToProps = (state: SauseeState, ownProps: ExternalFieldGroupProps) => {
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