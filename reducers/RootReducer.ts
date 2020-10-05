import "react-native-get-random-values";
import { ActionType, ADD_ROUTE_PATH_COORDINATES, CHANGE_COUNTER, CREATE_OBSERVATION, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, SET_OBSERVATION_COORDINATES } from "../shared/Actions";
import { Observation, SauseeState, Trip } from "../shared/TypeDefinitions";
import { Observable, Reducer } from "redux";
import { v4 as uuidv4 } from "uuid";
import produce from "immer";


const initState: SauseeState = {
  currentTripId: "ac9681df-3c44-4e94-afee-82560c34af9a",
  currentObservationId: "",
  trips: [
    {
      id: "ac9681df-3c44-4e94-afee-82560c34af9a",
      timestamp: Date.now(),
      routePath: [
        { lat: 63.0, lon: 10.2 },
        { lat: 63.0, lon: 10.2 }
      ],
      observations: [
        {
          id: "9d238812-e53f-4f4a-9b98-bfb9c3cf7bf0",
          timestamp: Date.now(),
          yourCoordinates: { lat: 63.0, lon: 10.2 },
          sheepCoordinates: { lat: 63.0, lon: 10.2 },
          sheepCountTotal: 12,
          eweCount: 4,
          lambCount: 8,
          blueTieCount: 0,
          greenTieCount: 0,
          yellowTieCount: 0,
          redTieCount: 0,
          missingTieCount: 0,
          whiteSheepCount: 1,
          graySheepCount: 1,
          brownSheepCount: 1,
          blackSheepCount: 1,
          blackHeadSheepCount: 1
        }
      ]
    }
  ]
}

export const rootReducer: Reducer<SauseeState, ActionType> = produce((draft: SauseeState, action: ActionType) => {
  console.log("Received action: ", action);
  console.log("State before: ", draft);

  const currentTrip = draft.trips.find(t => t.id === draft.currentTripId);
  let currentObservation = currentTrip?.observations.find(o => o.id === draft.currentObservationId);

  switch (action.type) {
    case CHANGE_COUNTER:
      if (currentObservation) {
        currentObservation[action.payload.counterName] += action.payload.change;
      }
      break;

    case CREATE_TRIP:
      draft.currentTripId = uuidv4();
      draft.trips.push({
        id: draft.currentTripId,
        timestamp: Date.now(),
        observations: [],
        routePath: []
      });
      break;

    case CREATE_OBSERVATION:
      if (currentTrip && !currentObservation) {
        currentObservation = newObservation(uuidv4());
        draft.currentObservationId = currentObservation.id;
        currentTrip.observations.push(currentObservation);
      }
      break;

    case SET_OBSERVATION_COORDINATES:
      if (currentTrip) {
        if (!currentObservation) {
          currentObservation = newObservation(uuidv4());
          draft.currentObservationId = currentObservation.id;
          currentTrip.observations.push(currentObservation);
        }
        currentObservation.yourCoordinates = action.payload.yourCoordinates;
        currentObservation.sheepCoordinates = action.payload.sheepCoordinates;
      }
      break;

    case FINISH_OBSERVATION:
      draft.currentObservationId = ""; // TODO nullable
      break;

    case FINISH_TRIP:
      draft.currentObservationId = "";
      draft.currentTripId = "";
      break;

    case ADD_ROUTE_PATH_COORDINATES:
      if (currentTrip) {
        currentTrip.routePath.push(action.payload.coordinates);
      }
      break;
  }

  console.log("State after: ", draft);
}, initState);

function newObservation(id: string): Observation {
  return {
    id,
    timestamp: Date.now(),
    yourCoordinates: undefined,
    sheepCoordinates: undefined,
    sheepCountTotal: 0,
    eweCount: undefined,
    lambCount: undefined,
    blueTieCount: undefined,
    greenTieCount: undefined,
    yellowTieCount: undefined,
    redTieCount: undefined,
    missingTieCount: undefined,
    whiteSheepCount: 0,
    graySheepCount: 0,
    brownSheepCount: 0,
    blackSheepCount: 0,
    blackHeadSheepCount: 0
  };
}
