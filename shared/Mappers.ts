import { SauseeState } from "./TypeDefinitions";

export const mapCurrentObservationToProps = (state: SauseeState) => ({
  observation: state.currentObservation
});
