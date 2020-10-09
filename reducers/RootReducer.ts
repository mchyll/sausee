import "react-native-get-random-values";
import { ActionType, ADD_ROUTE_PATH_COORDINATES, BEGIN_OBSERVATION, CHANGE_COUNTER, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, CANCEL_OBSERVATION } from "../shared/Actions";
import { SauseeState } from "../shared/TypeDefinitions";
import { Reducer } from "redux";
import { v4 as uuidv4 } from "uuid";
import produce from "immer";


const initState: SauseeState = {
  currentTripId: "ac9681df-3c44-4e94-afee-82560c34af9a",
  currentObservationId: null,
  trips: [
    {
      id: "ac9681df-3c44-4e94-afee-82560c34af9a",
      timestamp: Date.now(),
      routePath: [],
      observations: []
    }
  ]
}

export const rootReducer: Reducer<SauseeState, ActionType> = produce((draft: SauseeState, action: ActionType) => {
  console.log(`Received action ${action.type}, payload: `, action.payload);

  const currentTrip = draft.trips.find(t => t.id === draft.currentTripId);
  const currentObservation = currentTrip?.observations.find(o => o.id === draft.currentObservationId);

  switch (action.type) {
    case CHANGE_COUNTER:
      if (currentObservation) {
        if (currentObservation[action.payload.counterName] === undefined) currentObservation[action.payload.counterName] = 0;

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

    case CANCEL_OBSERVATION:
      if (currentObservation) {
        currentTrip?.observations.pop(); // new observation will always be at the end of the array
        draft.currentObservationId = null;
      }

      break;

    case BEGIN_OBSERVATION:
      if (currentTrip) {
        let newObservation = {
          id: uuidv4(),
          timestamp: Date.now(),
          yourCoordinates: action.payload.yourCoordinates,
          sheepCoordinates: action.payload.sheepCoordinates,
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
        draft.currentObservationId = newObservation.id;
        currentTrip.observations.push(newObservation);
      }
      break;

    case FINISH_OBSERVATION:
      if (currentObservation) {
        if (action.payload.yourCoordinates) {
          currentObservation.yourCoordinates = action.payload.yourCoordinates;
        }
        if (action.payload.sheepCoordinates) {
          currentObservation.sheepCoordinates = action.payload.sheepCoordinates;
        }
        draft.currentObservationId = null;
      }
      break;

    case FINISH_TRIP:
      draft.currentObservationId = null;
      draft.currentTripId = null;
      break;

    case ADD_ROUTE_PATH_COORDINATES:
      if (currentTrip) {
        currentTrip.routePath.push(action.payload.coordinates);
      }
      break;
  }

  console.log("State after: ", draft, "\n");
}, initState);
