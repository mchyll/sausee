import { SauseeState } from "./TypeDefinitions";

export const mapCurrentSheepObservationToProps = (state: SauseeState) => ({
  observation: state.currentObservation?.type === "SHEEP" ? state.currentObservation : null,
  editable: state.currentObservation?.editable ?? false
});
