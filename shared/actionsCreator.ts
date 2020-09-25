import * as actions from "./actions";
import { Action } from "./actions";
import { CounterNames, Coordinates } from "./TypeDefinitions";



export function incrementCounter(counterName: CounterNames): Action {
  return {
    type: actions.INCREMENT_COUNTER,
    payload: {
      counterName
    }
  }
}

export function decrementCounter(counterName: CounterNames): Action {
  return {
    type: actions.DECREMENT_COUNTER,
    payload: {
      counterName
    }
  }
}

export function createTrip(): Action {
  return {
    type: actions.CREATE_TRIP,
    payload: null
  }
}

export function createObservation(): Action {
  return {
    type: actions.CREATE_OBSERVATION,
    payload: null
  }
}

export function setObservationCoordinates(yourCoordinates: Coordinates, sheepCoordinates: Coordinates): Action {
  return {
    type: actions.SET_OBSERVATION_COORDINATES,
    payload: {
      yourCoordinates,
      sheepCoordinates
    }
  }
}

export function finishObservation(): Action {
  return {
    type: actions.FINISH_OBSERVATION,
    payload: null
  }
}

export function finishTrip(): Action {
  return {
    type: actions.FINISH_TRIP,
    payload: null
  }
}

export function addRoutePathCoordinates(coordinates: Coordinates): Action {
  return {
    type: actions.ADD_ROUTE_PATH_COORDINATES,
    payload: {
      coordinates
    }
  }
}
