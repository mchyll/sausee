import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect, ConnectedProps } from "react-redux";
import { CounterName } from "../shared/TypeDefinitions";
import { observationKtsn } from "../key_to_speech_name/ObservationKtsn";
import { Text, View } from "react-native";
import { mapCurrentObservationToProps } from "../shared/Mappers";

interface ExternalTotalFieldGroupProps {
  onPressed: (initCounterIndex: number, counterNames: CounterName[]) => void,
}

const connector = connect(mapCurrentObservationToProps);

type TotalFieldGroupProps = ConnectedProps<typeof connector> & ExternalTotalFieldGroupProps;

const counters: CounterName[] = ["sheepCountTotal", "eweCount", "lambCount"];

const TotalFieldGroup = (props: TotalFieldGroupProps) => {

  if (!props.observation) {
    return <></>
  }

  const navigate = (i: number) => {
    props.onPressed(i, counters);
  }

  return (
    <FieldGroupFrame title="Totalt">
      <Field value={props.observation["sheepCountTotal"]} description={observationKtsn["sheepCountTotal"]} onPressed={() => navigate(0)}></Field>
      <Text style={{ fontSize: 40 }}>=</Text>
      <View style={{ alignItems: "center" }}>
        <Field value={props.observation["eweCount"]} description={observationKtsn["eweCount"]} onPressed={() => navigate(1)}></Field>
        <Text style={{ fontSize: 30 }}>+</Text>
        <Field value={props.observation["lambCount"]} description={observationKtsn["lambCount"]} onPressed={() => navigate(2)}></Field>
      </View>
    </FieldGroupFrame>
  );
}

export default connector(TotalFieldGroup);
