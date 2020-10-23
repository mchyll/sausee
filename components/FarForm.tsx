import React from 'react';
import { CounterName } from '../shared/TypeDefinitions';
import FieldGroup from './FieldGroup';
import TotalFieldGroup from './TotalFieldGroup';

const total:CounterName[] = ["sheepCountTotal"];
const colors: CounterName[] = ["whiteGreySheepCount","brownSheepCount", "blackSheepCount"];
const allFields: CounterName[] = ["sheepCountTotal", "whiteGreySheepCount", "blackSheepCount", "brownSheepCount", "blueTieCount", "greenTieCount", "yellowTieCount", "redTieCount", "missingTieCount"]

interface FarFormProps {
  nav: (initCounterIndex: number, counterNames: CounterName[]) => void,

}

const FarForm = (props: FarFormProps) => (
  <>
    <FieldGroup title="Totalt" fields={total} onPressed={props.nav} />
    <FieldGroup title="Farge" fields={colors} onPressed={props.nav} />
  </>
)

export default FarForm;