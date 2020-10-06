import { ActionType, ADD_ROUTE_PATH_COORDINATES, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, CHANGE_COUNTER, BEGIN_OBSERVATION } from "./Actions";
import { CounterName, Coordinates } from "./TypeDefinitions";


export function changeCounter(counterName: CounterName, change: number): ActionType {
  return {
    type: CHANGE_COUNTER,
    payload: {
      counterName,
      change
    }
  }
}

export function createTrip(): ActionType {
  return {
    type: CREATE_TRIP,
    payload: null
  }
}

export function beginObservation(yourCoordinates?: Coordinates, sheepCoordinates?: Coordinates): ActionType {
  return {
    type: BEGIN_OBSERVATION,
    payload: {
      yourCoordinates,
      sheepCoordinates
    }
  }
}

export function finishObservation(yourCoordinates?: Coordinates, sheepCoordinates?: Coordinates): ActionType {
  return {
    type: FINISH_OBSERVATION,
    payload: {
      yourCoordinates,
      sheepCoordinates
    }
  }
}

export function finishTrip(): ActionType {
  return {
    type: FINISH_TRIP,
    payload: null
  }
}

export function addRoutePathCoordinates(coordinates: Coordinates): ActionType {
  return {
    type: ADD_ROUTE_PATH_COORDINATES,
    payload: {
      coordinates
    }
  }
}
