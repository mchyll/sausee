import React from 'react';
import { CounterName } from '../shared/TypeDefinitions';
import EarGroup from './EarGroup';
import FieldGroup from './FieldGroup';
import TotalFieldGroup from './TotalFieldGroup';

const colors: CounterName[] = ["whiteGreySheepCount", "brownSheepCount", "blackSheepCount"];
const ties: CounterName[] = ["blueTieCount", "greenTieCount", "yellowTieCount", "redTieCount", "missingTieCount"];

interface NearFormExtensionProps {
  nav: (initCounterIndex: number, counterNames: CounterName[]) => void,

}

const NearFormExtension = (props: NearFormExtensionProps) => (
  <>
    
    <FieldGroup title="Slips" fields={ties} onPressed={props.nav} />
    
  </>
)

export default NearFormExtension;

// todo add ear color <EarGroup/>