import { ADD_ROUTE_PATH_COORDINATES, AppAction, CREATE_OBSERVATION, CREATE_TRIP, INCREMENT_COUNTER } from "../shared/Actions";
import { AppState } from "../shared/TypeDefinitions";

const initState: AppState = {
  currentTrip: "GUID lol",
  currentObservation: "GUID",
  trips: [
    {
      id: "GUID lol",
      timestamp: Date.now(),
      routePath: [
        { lat: 63.0, lon: 10.2 },
        { lat: 63.0, lon: 10.2 }
      ],
      observations: [
        {
          id: "GUID",
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



export function rootReducer(state: AppState = initState, action: AppAction): AppState {

  console.log("Received action: ", action);

  const currentTripIndex = state.trips.findIndex(t => t.id === state.currentTrip);
  const currentObservationIndex = currentTripIndex >= 0 ? state.trips[currentTripIndex].observations.findIndex(o => o.id === state.currentObservation) : -1;

  switch (action.type) {
    case INCREMENT_COUNTER:
      if (currentTripIndex < 0 || currentObservationIndex < 0) {
        return state;
      }

      let trips = [...state.trips];
      let currentTrip = { ...state.trips[currentTripIndex] };
      let currentObservation = { ...currentTrip.observations[currentObservationIndex] };
      currentObservation[action.payload.counterName]++;
      currentTrip.observations[currentObservationIndex] = currentObservation;
      trips[currentTripIndex] = currentTrip;

      return {
        ...state,
        trips
      }

    case CREATE_TRIP:
      const tripId = "Generate GUID lol";
      return {
        ...state,
        currentTrip: tripId,
        trips: [...state.trips, {
          id: tripId,
          timestamp: Date.now(),
          observations: [],
          routePath: []
        }]
      }

    case CREATE_OBSERVATION:
      const observationId = "Generate GUID lol";
      const trip = { ...state.trips[currentTripIndex] };

    default:
      return state;
  }
}