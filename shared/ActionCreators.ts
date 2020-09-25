import * as actions from "./Actions";
import { AppAction } from "./Actions";
import { CounterNames, Coordinates } from "./TypeDefinitions";



export function incrementCounter(counterName: CounterNames): AppAction {
  return {
    type: actions.INCREMENT_COUNTER,
    payload: {
      counterName
    }
  }
}

export function decrementCounter(counterName: CounterNames): AppAction {
  return {
    type: actions.DECREMENT_COUNTER,
    payload: {
      counterName
    }
  }
}

export function createTrip(): AppAction {
  return {
    type: actions.CREATE_TRIP,
    payload: null
  }
}

export function createObservation(): AppAction {
  return {
    type: actions.CREATE_OBSERVATION,
    payload: null
  }
}

export function setObservationCoordinates(yourCoordinates: Coordinates, sheepCoordinates: Coordinates): AppAction {
  return {
    type: actions.SET_OBSERVATION_COORDINATES,
    payload: {
      yourCoordinates,
      sheepCoordinates
    }
  }
}

export function finishObservation(): AppAction {
  return {
    type: actions.FINISH_OBSERVATION,
    payload: null
  }
}

export function finishTrip(): AppAction {
  return {
    type: actions.FINISH_TRIP,
    payload: null
  }
}

export function addRoutePathCoordinates(coordinates: Coordinates): AppAction {
  return {
    type: actions.ADD_ROUTE_PATH_COORDINATES,
    payload: {
      coordinates
    }
  }
}
