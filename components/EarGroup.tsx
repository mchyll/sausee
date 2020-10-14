import React, { useState } from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";
import { connect, ConnectedProps } from "react-redux";
import { CounterName, Observation, SauseeState } from "../shared/TypeDefinitions";
import { observationKtsn } from "../key_to_speech_name/ObservationKtsn";
import { mapCurrentObservationToProps } from "../shared/Mappers";
import { Switch } from "react-native";



const connector = connect(mapCurrentObservationToProps);

type FieldGroupProps = ConnectedProps<typeof connector>

const EarGroup = (props: FieldGroupProps) => {

  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <FieldGroupFrame title="Ørefarger">
      <Switch
        onValueChange={(value) => setIsEnabled(value)}
        value={isEnabled}
      />
    </FieldGroupFrame>
  );
}

export default connector(EarGroup);
