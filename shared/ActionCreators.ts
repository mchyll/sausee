import { ActionType, ADD_ROUTE_PATH_COORDINATES, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, CHANGE_COUNTER, BEGIN_OBSERVATION, CANCEL_OBSERVATION, DELETE_OBSERVATION, SET_CURRENT_OBSERVATION, SET_PREVIOUS_TRIP_OVERLAY_INDEX, SET_IS_NEAR_FORM} from "./Actions";
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

export function cancelObservation(): ActionType {
  return {
    type: CANCEL_OBSERVATION,
    payload: null
  }
}

export function deleteObservation(): ActionType {
  return {
    type: DELETE_OBSERVATION,
    payload: null
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

export function setCurrentObservation(observationId: string): ActionType {
  return {
    type: SET_CURRENT_OBSERVATION,
    payload: {
      observationId
    }
  }
}

export function setPreviousTripOverlayIndex(tripId: number): ActionType {
  return {
    type: SET_PREVIOUS_TRIP_OVERLAY_INDEX,
    payload: {
      tripId
    }
  }
}

export function setIsNearForm(isNearForm: boolean): ActionType {
  return {
    type: SET_IS_NEAR_FORM,
    payload: {
      isNearForm
    }
  }
}