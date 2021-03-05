import { SauseeState } from "./TypeDefinitions";

export const mapCurrentSheepObservationToProps = (state: SauseeState) => ({
  observation: state.currentObservation?.type === "SHEEP" ? state.currentObservation : null,
  editable: state.trips.find(t => t.id === state.currentTripId)?.editable ?? false
});
