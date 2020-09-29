import { ActionType, ADD_ROUTE_PATH_COORDINATES, CHANGE_COUNTER, CREATE_OBSERVATION, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, SET_OBSERVATION_COORDINATES } from "../shared/Actions";
import { SauseeState } from "../shared/TypeDefinitions";
import { Reducer } from "redux";
import { v4 as uuidv4 } from "uuid";
import produce from "immer";

const initState: SauseeState = {
  currentTrip: "ac9681df-3c44-4e94-afee-82560c34af9a",
  currentObservation: "9d238812-e53f-4f4a-9b98-bfb9c3cf7bf0",
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

  // const currentTripIndex = draft.trips.findIndex(t => t.id === draft.currentTrip);
  // const currentObservationIndex = currentTripIndex >= 0 ? draft.trips[currentTripIndex].observations.findIndex(o => o.id === draft.currentObservation) : -1;
  const currentTrip = draft.trips.find(t => t.id === draft.currentTrip);
  const currentObservation = currentTrip?.observations.find(o => o.id === draft.currentObservation);

  switch (action.type) {
    case CHANGE_COUNTER:
      if (currentObservation) {
        currentObservation[action.payload.counterName] += action.payload.change;
      }

      // let trips = [...state.trips];
      // let currentTrip = { ...state.trips[currentTripIndex] };
      // let currentObservation = { ...currentTrip.observations[currentObservationIndex] };
      // currentObservation[action.payload.counterName]++;
      // currentTrip.observations[currentObservationIndex] = currentObservation;
      // trips[currentTripIndex] = currentTrip;

      // let test: AppState = {
      //   ...state,
      //   trips: [
      //     ...state.trips.slice(0, currentTripIndex),
      //     {
      //       ...state.trips[currentTripIndex],
      //       observations: [
      //         ...currentTrip.observations.slice(0, currentObservationIndex),
      //         {
      //           ...currentObservation,
      //           [action.payload.counterName]: currentObservation === undefined ? 1 : currentObservation[action.payload.counterName] + 1
      //         },
      //         ...currentTrip.observations.slice(currentObservationIndex + 1)
      //       ]
      //     },
      //     ...state.trips.slice(currentObservationIndex + 1)
      //   ]
      // }

      // let test2 = produce(state, draft => {
      //   draft.trips[currentTripIndex].observations[currentObservationIndex][action.payload.counterName]++
      // });

      // return {
      //   ...state,
      //   trips
      // }

      break;

    case CREATE_TRIP:
      draft.currentTrip = uuidv4();
      draft.trips.push({
        id: draft.currentTrip,
        timestamp: Date.now(),
        observations: [],
        routePath: []
      });
      break;

    // return {
    //   ...draft,
    //   currentTrip: tripId,
    //   trips: [...draft.trips, {
    //     id: tripId,
    //     timestamp: Date.now(),
    //     observations: [],
    //     routePath: []
    //   }]
    // }

    case CREATE_OBSERVATION:
      if (currentTrip) {
        draft.currentObservation = uuidv4();
        currentTrip.observations.push({
          id: draft.currentObservation,
          timestamp: Date.now(),
          yourCoordinates: { lat: 0, lon: 0 },
          sheepCoordinates: { lat: 0, lon: 0 },
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
        });
      }
      break;

    case SET_OBSERVATION_COORDINATES:
      if (currentObservation) {
        currentObservation.yourCoordinates = action.payload.yourCoordinates;
        currentObservation.sheepCoordinates = action.payload.sheepCoordinates;
      }
      break;

    case FINISH_OBSERVATION:
      draft.currentObservation = "";
      break;

    case FINISH_TRIP:
      draft.currentObservation = "";
      break;

    case ADD_ROUTE_PATH_COORDINATES:
      if (currentTrip) {
        currentTrip.routePath.push(action.payload.coordinates);
      }
      break;
  }
}, initState);
