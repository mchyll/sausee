import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect, ConnectedProps } from "react-redux";
import { CounterName, Observation, SauseeState } from "../shared/TypeDefinitions";
import { observationKtsn } from "../key_to_speech_name/ObservationKtsn";
import { mapCurrentObservationToProps } from "../shared/Mappers";


interface ExternalFieldGroupProps {
  onPressed: (initCounterIndex: number, counterNames: CounterName[]) => void,
  title: string,
  fields: CounterName[],
}

const connector = connect(mapCurrentObservationToProps);

type FieldGroupProps = ConnectedProps<typeof connector> & ExternalFieldGroupProps

const FieldGroup = (props: FieldGroupProps) => {

  const navigate = (i: number) => props.onPressed(i, props.fields);

  return (
    <FieldGroupFrame title={props.title}>
      {props.fields.map((field, i) => <Field key={field} value={props.observation?.[field]} description={observationKtsn[field]} onPressed={() => navigate(i)}></Field>)}

    </FieldGroupFrame>
  );
}

export default connector(FieldGroup);
