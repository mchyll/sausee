import { SauseeState } from "./TypeDefinitions";

export const mapCurrentObservationToProps = (state: SauseeState) => ({
  observation: state.trips.find(t => t.id === state.currentTripId)?.observations.find(o => o.id === state.currentObservationId)
});
