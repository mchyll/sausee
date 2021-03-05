import "react-native-get-random-values";
import { ActionType, ADD_ROUTE_PATH_COORDINATES, BEGIN_OBSERVATION, CHANGE_COUNTER, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, CANCEL_OBSERVATION, DELETE_OBSERVATION, SET_CURRENT_OBSERVATION, SET_TRIP_OVERLAY_INDEX, SET_IS_NEAR_FORM, SET_CURRENT_TRIP_ID, SET_USE_LOCAL_TILES, ADD_OBSERVATION_PHOTO, REMOVE_OBSERVATION_PHOTO, CHANGE_OBSERVATION_DESCRIPTION, SET_PREDATOR_COUNT, SET_PREDATOR_SPECIES, RESET_STATE } from "../shared/Actions";
import { Coordinates, Observation, ObservationBase, SauseeState, SheepObservation } from "../shared/TypeDefinitions";
import { Reducer } from "redux";
import { v4 as uuidv4 } from "uuid";
import produce from "immer";


const initState: SauseeState = {
  currentTripId: null,
  currentObservation: null,
  trips: [],
  tripOverlayIndex: -1,
  isUsingLocalTiles: true,
}

export const rootReducer: Reducer<SauseeState, ActionType> = produce((draft: SauseeState, action: ActionType) => {
  console.log(`Received action ${action.type}, payload: ${JSON.stringify(action.payload)}`);

  const currentTrip = draft.trips.find(t => t.id === draft.currentTripId);

  switch (action.type) {
    case CHANGE_COUNTER:
      if (draft.currentObservation && draft.currentObservation.type === "SHEEP") {
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
        mapRegion: action.payload.mapRegion,
        editable: true
      });
      break;

    case CANCEL_OBSERVATION:
      if (draft.currentObservation) {
        draft.currentObservation = null;
      }
      break;

    case DELETE_OBSERVATION:
      if (currentTrip?.editable && draft.currentObservation) {
        delete currentTrip.observations[draft.currentObservation.id];
        draft.currentObservation = null;
      }
      break;

    case BEGIN_OBSERVATION:
      if (currentTrip?.editable) {
        const observationBase: ObservationBase = {
          id: uuidv4(),
          timestamp: Date.now(),
          yourCoordinates: action.payload.yourCoordinates,
          animalCoordinates: action.payload.animalCoordinates,
          isNewObservation: true,
        };

        switch (action.payload.type) {
          case "SHEEP":
            draft.currentObservation = {
              ...observationBase,
              type: action.payload.type,
              sheepCountTotal: 0,
              blueTieCount: undefined,
              greenTieCount: undefined,
              yellowTieCount: undefined,
              redTieCount: undefined,
              missingTieCount: undefined,
              whiteGreySheepCount: 0,
              brownSheepCount: 0,
              blackSheepCount: 0,
              isNearForm: isCloseToSheep(action.payload.yourCoordinates, action.payload.animalCoordinates),
            };
            break;

          case "PREDATOR":
            draft.currentObservation = {
              ...observationBase,
              type: action.payload.type,
              count: 1,
              species: "jerv", // default. Gjør det enklere. Men er det riktig?
            };
            break;

          case "INJURED_SHEEP":
            draft.currentObservation = {
              ...observationBase,
              type: action.payload.type,
              description: "",
              imagePaths: [],
            };
            break;

          case "DEAD_SHEEP":
            draft.currentObservation = {
              ...observationBase,
              type: action.payload.type,
              description: "",
              imagePaths: [],
            };
            break;
        }
      }
      break;

    case FINISH_OBSERVATION:
      if (draft.currentObservation) {
        if (currentTrip?.editable) {
          currentTrip.observations[draft.currentObservation.id] = draft.currentObservation;
        }
        draft.currentObservation = null;
      }
      break;

    case FINISH_TRIP:
      if (currentTrip) {
        currentTrip.editable = false;
      }
      draft.currentObservation = null;
      draft.currentTripId = null;
      break;

    case ADD_ROUTE_PATH_COORDINATES:
      if (currentTrip?.editable) {
        currentTrip.routePath.push(action.payload.coordinates);
      }
      break;

    case SET_CURRENT_OBSERVATION:
      if (currentTrip) {
        const obsToSet = currentTrip.observations[action.payload.observationId];
        if (obsToSet) {
          obsToSet.isNewObservation = false;
          draft.currentObservation = obsToSet;
        }
      }
      break;

    case SET_TRIP_OVERLAY_INDEX:
      draft.tripOverlayIndex = action.payload.tripIndex;
      break;

    case SET_IS_NEAR_FORM:
      if (currentTrip && draft.currentObservation && draft.currentObservation.type === "SHEEP") {
        draft.currentObservation.isNearForm = action.payload.isNearForm;
      }
      break;

    case SET_CURRENT_TRIP_ID:
      draft.currentTripId = action.payload.tripId;
      break;

    case SET_PREDATOR_SPECIES:
      if (currentTrip && draft.currentObservation?.type === "PREDATOR") {
        draft.currentObservation.species = action.payload.species;
      }
      break;

    case SET_PREDATOR_COUNT:
      if (currentTrip && draft.currentObservation?.type === "PREDATOR") {
        draft.currentObservation.count = action.payload.count;
      }
      break;

    case ADD_OBSERVATION_PHOTO:
      if (currentTrip && (draft.currentObservation?.type === "INJURED_SHEEP" || draft.currentObservation?.type === "DEAD_SHEEP")) {
        draft.currentObservation.imagePaths.push(action.payload.imageUri);
      }
      break;

    case REMOVE_OBSERVATION_PHOTO:
      if (currentTrip && (draft.currentObservation?.type === "INJURED_SHEEP" || draft.currentObservation?.type === "DEAD_SHEEP")) {
        draft.currentObservation.imagePaths = draft.currentObservation.imagePaths.filter(p => p !== action.payload.imageUri);
      }
      break;

    case CHANGE_OBSERVATION_DESCRIPTION:
      if (currentTrip && (draft.currentObservation?.type === "INJURED_SHEEP" || draft.currentObservation?.type === "DEAD_SHEEP")) {
        draft.currentObservation.description = action.payload.description;
      }
      break;

    case SET_USE_LOCAL_TILES:
      draft.isUsingLocalTiles = action.payload.use;
      break;

    case RESET_STATE:
      return initState;
  }

  // console.log("State after: ", draft, "\n");
}, initState);

const isCloseToSheep = (p1: Coordinates | undefined, p2: Coordinates | undefined) => { // maybe use Vincenty's formulae istead? It takes earth's shape more into account https://en.wikipedia.org/wiki/Vincenty%27s_formulae
  if (!p1 || !p2) {
    return false;
  }
  const deg2rad = Math.PI / 180;
  const r = 6371000; // Earth radius in meters. Source: googleing "radius earth", and google showing it directly
  // Haversine formula. Source: https://en.wikipedia.org/wiki/Haversine_formula
  let distance = 2 * r * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin(deg2rad * (p1.latitude - p2.latitude) / 2), 2)
      + Math.cos(deg2rad * p1.latitude) * Math.cos(deg2rad * p2.latitude)
      * Math.pow(Math.sin(deg2rad * (p1.longitude - p2.longitude) / 2), 2)
    )
  );
  return distance < 50;
};