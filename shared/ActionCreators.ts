import {
  ActionType, ADD_ROUTE_PATH_COORDINATES, CREATE_OBSERVATION,
  CREATE_TRIP, DECREMENT_COUNTER, FINISH_OBSERVATION, FINISH_TRIP,
  INCREMENT_COUNTER, SET_OBSERVATION_COORDINATES
} from "./Actions";
import { CounterNames, Coordinates } from "./TypeDefinitions";



export function incrementCounter(counterName: CounterNames): ActionType {
  return {
    type: INCREMENT_COUNTER,
    payload: {
      counterName
    }
  }
}

export function decrementCounter(counterName: CounterNames): ActionType {
  return {
    type: DECREMENT_COUNTER,
    payload: {
      counterName
    }
  }
}

export function createTrip(): ActionType {
  return {
    type: CREATE_TRIP,
    payload: null
  }
}

export function createObservation(): ActionType {
  return {
    type: CREATE_OBSERVATION,
    payload: null
  }
}

export function setObservationCoordinates(yourCoordinates: Coordinates, sheepCoordinates: Coordinates): ActionType {
  return {
    type: SET_OBSERVATION_COORDINATES,
    payload: {
      yourCoordinates,
      sheepCoordinates
    }
  }
}

export function finishObservation(): ActionType {
  return {
    type: FINISH_OBSERVATION,
    payload: null
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
