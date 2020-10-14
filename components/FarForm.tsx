import React from 'react';
import { CounterName } from '../shared/TypeDefinitions';
import FieldGroup from './FieldGroup';
import TotalFieldGroup from './TotalFieldGroup';

const colors: CounterName[] = ["whiteGreySheepCount","brownSheepCount", "blackSheepCount"];

interface FarFormProps {
  nav: (initCounterIndex: number, counterNames: CounterName[]) => void,

}

const FarForm = (props: FarFormProps) => (
  <>
    <FieldGroup title="Totalt" fields={["sheepCountTotal"]} onPressed={props.nav} />
    <FieldGroup title="Farge" fields={colors} onPressed={props.nav} />
  </>
)

export default FarForm;