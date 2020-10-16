import React from 'react';
import { CounterName } from '../shared/TypeDefinitions';
import FieldGroup from './FieldGroup';

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