import { Region } from "react-native-maps";
import { ActionType, ADD_ROUTE_PATH_COORDINATES, CREATE_TRIP, FINISH_OBSERVATION, FINISH_TRIP, CHANGE_COUNTER, BEGIN_OBSERVATION, CANCEL_OBSERVATION, DELETE_OBSERVATION, SET_CURRENT_OBSERVATION, SET_TRIP_OVERLAY_INDEX, SET_IS_NEAR_FORM, SET_CURRENT_TRIP_ID, SET_USE_LOCAL_TILES, ADD_OBSERVATION_PHOTO, REMOVE_OBSERVATION_PHOTO, CHANGE_OBSERVATION_DESCRIPTION, SET_PREDATOR_SPECIES, SET_PREDATOR_COUNT } from "./Actions";
import { SheepCounterName, Coordinates, Observation } from "./TypeDefinitions";


export function changeCounter(counterName: SheepCounterName, change: number): ActionType {
  return {
    type: CHANGE_COUNTER,
    payload: {
      counterName,
      change
    }
  }
}

export function createTrip(mapRegion: Region): ActionType {
  return {
    type: CREATE_TRIP,
    payload: {
      mapRegion
    }
  }
}

export function beginObservation(type: Observation["type"], yourCoordinates: Coordinates, animalCoordinates: Coordinates): ActionType {
  return {
    type: BEGIN_OBSERVATION,
    payload: {
      type,
      yourCoordinates,
      animalCoordinates
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

export function setCurrentObservation(observationId: string): ActionType {
  return {
    type: SET_CURRENT_OBSERVATION,
    payload: {
      observationId
    }
  }
}

export function setTripOverlayIndex(tripIndex: number): ActionType {
  return {
    type: SET_TRIP_OVERLAY_INDEX,
    payload: {
      tripIndex
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

export function setCurrentTripId(tripId: string): ActionType {
  return {
    type: SET_CURRENT_TRIP_ID,
    payload: {
      tripId
    }
  }
}

export function setPredatorSpecies(species: string): ActionType {
  return {
    type: SET_PREDATOR_SPECIES,
    payload: {
      species,
    }
  }
}

export function addObservationPhoto(imageUri: string): ActionType {
  return {
    type: ADD_OBSERVATION_PHOTO,
    payload: {
      imageUri
    }
  }
}

export function setPredatorCount(count: number): ActionType {
  return {
    type: SET_PREDATOR_COUNT, 
    payload: {
      count
    }
  }
}
export function removeObservationPhoto(imageUri: string): ActionType {
  return {
    type: REMOVE_OBSERVATION_PHOTO,
    payload: {
      imageUri
    }
  }
}

export function changeObservationDescription(description: string): ActionType {
  return {
    type: CHANGE_OBSERVATION_DESCRIPTION,
    payload: {
      description
    }
  }
}

export function setUseLocalTiles(use: boolean): ActionType {
  return {
    type: SET_USE_LOCAL_TILES,
    payload: {
      use
    }
  }
}
