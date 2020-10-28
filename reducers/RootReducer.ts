import "react-native-get-random-values";
import { ActionType, ADD_ROUTE_PATH_COORDINATES, BEGIN_OBSERVATION, CHANGE_COUNTER, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, CANCEL_OBSERVATION, DELETE_OBSERVATION, SET_CURRENT_OBSERVATION } from "../shared/Actions";
import { Observation, SauseeState } from "../shared/TypeDefinitions";
import { Reducer } from "redux";
import { v4 as uuidv4 } from "uuid";
import produce from "immer";


const initState: SauseeState = {
  currentTripId: null,
  currentObservation: null,
  trips: []
}

export const rootReducer: Reducer<SauseeState, ActionType> = produce((draft: SauseeState, action: ActionType) => {
  console.log(`Received action ${action.type}, payload: ${JSON.stringify(action.payload)}`);

  const currentTrip = draft.trips.find(t => t.id === draft.currentTripId);

  switch (action.type) {
    case CHANGE_COUNTER:
      if (draft.currentObservation) {
        draft.currentObservation[action.payload.counterName] = Math.max((draft.currentObservation[action.payload.counterName] ?? 0) + action.payload.change, 0);
      }
      break;

    case CREATE_TRIP:
      draft.currentTripId = uuidv4();
      draft.trips.push({
        id: draft.currentTripId,
        timestamp: Date.now(),
        observations: {},
        routePath: []
      });
      break;

    case CANCEL_OBSERVATION:
      if (draft.currentObservation) {
        draft.currentObservation = null;
      }
      break;

    case DELETE_OBSERVATION:
      if (draft.currentObservation) {
        delete currentTrip?.observations[draft.currentObservation.id];
        draft.currentObservation = null;
      }
      break;

    case BEGIN_OBSERVATION:
      if (currentTrip) {
        draft.currentObservation = {
          id: uuidv4(),
          timestamp: Date.now(),
          yourCoordinates: action.payload.yourCoordinates,
          sheepCoordinates: action.payload.sheepCoordinates,
          sheepCountTotal: 0,
          blueTieCount: undefined,
          greenTieCount: undefined,
          yellowTieCount: undefined,
          redTieCount: undefined,
          missingTieCount: undefined,
          whiteGreySheepCount: 0,
          brownSheepCount: 0,
          blackSheepCount: 0,
        };
      }
      break;

    case FINISH_OBSERVATION:
      if (currentTrip && draft.currentObservation) {
        if (action.payload.yourCoordinates) {
          draft.currentObservation.yourCoordinates = action.payload.yourCoordinates;
        }
        if (action.payload.sheepCoordinates) {
          draft.currentObservation.sheepCoordinates = action.payload.sheepCoordinates;
        }
        currentTrip.observations[draft.currentObservation.id] = draft.currentObservation;
        draft.currentObservation = null;
      }
      break;

    case FINISH_TRIP:
      draft.currentObservation = null;
      draft.currentTripId = null;
      break;

    case ADD_ROUTE_PATH_COORDINATES:
      if (currentTrip) {
        currentTrip.routePath.push(action.payload.coordinates);
      }
      break;

    case SET_CURRENT_OBSERVATION:
      if (currentTrip) {
      const obsToSet:Observation = currentTrip.observations[action.payload.observationId];
      draft.currentObservation = obsToSet;
      }
      break;
  }

  // console.log("State after: ", draft, "\n");
}, initState);
