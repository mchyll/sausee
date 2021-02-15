import "react-native-get-random-values";
import { ActionType, ADD_ROUTE_PATH_COORDINATES, BEGIN_OBSERVATION, CHANGE_COUNTER, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, CANCEL_OBSERVATION, DELETE_OBSERVATION, SET_CURRENT_OBSERVATION, SET_TRIP_OVERLAY_INDEX, SET_IS_NEAR_FORM, SET_CURRENT_TRIP_ID } from "../shared/Actions";
import { Coordinates, Observation, SauseeState } from "../shared/TypeDefinitions";
import { Reducer } from "redux";
import { v4 as uuidv4 } from "uuid";
import produce from "immer";


const initState: SauseeState = {
  currentTripId: null,
  currentObservation: null,
  trips: [],
  tripOverlayIndex: -1,
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
        routePath: [],
        mapRegion: action.payload.mapRegion
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
          isNearForm: isCloseToSheep(action.payload.yourCoordinates, action.payload.sheepCoordinates),
          isNewObservation: true,
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
      if (currentTrip) {
        const obsToSet: Observation = currentTrip.observations[action.payload.observationId];
        obsToSet.isNewObservation = false;
        draft.currentObservation = obsToSet;
      }
      break;
    case SET_TRIP_OVERLAY_INDEX:
      draft.tripOverlayIndex = action.payload.tripId;
      break;
    case SET_IS_NEAR_FORM:
      if (currentTrip && draft.currentObservation) {
        draft.currentObservation.isNearForm = action.payload.isNearForm;
      }
      break;
    case SET_CURRENT_TRIP_ID:
      draft.currentTripId = action.payload.tripId;
      break;
  }

  // console.log("State after: ", draft, "\n");
}, initState);

const isCloseToSheep = (p1: Coordinates | undefined, p2: Coordinates | undefined) => { // maybe use Vincenty's formulae istead? It takes earth's shape more into account https://en.wikipedia.org/wiki/Vincenty%27s_formulae
  if (!p1 || !p2) {
    return false;
  }
  const deg2rad = Math.PI / 180;
  const r = 6371000; // Earth radius in meters. Source: googleing "radius earth", and google showing it directly
  // Haversine formula. Source: https://en.wikipedia.org/wiki/Haversine_formula
  let distance =  2 * r * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin(deg2rad * (p1.latitude - p2.latitude) / 2), 2)
      + Math.cos(deg2rad * p1.latitude) * Math.cos(deg2rad * p2.latitude)
      * Math.pow(Math.sin(deg2rad * (p1.longitude - p2.longitude) / 2), 2)
    )
  );
  return distance < 50;
};