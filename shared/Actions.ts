import { Action } from "redux";
import { CounterNames, Coordinates } from "./TypeDefinitions";

export type AppAction = Action<string> & ActionPayload;  // TODO refactor and make better name :)
export interface ActionPayload {
  payload: CounterActionPayload | SetObservationCoordinatesActionPayload | AddRoutePathCoordinatesActionPayload | null
}

export interface CounterActionPayload {
  counterName: CounterNames
}

export interface SetObservationCoordinatesActionPayload {
  yourCoordinates: Coordinates,
  sheepCoordinates: Coordinates
}

export interface AddRoutePathCoordinatesActionPayload {
  coordinates: Coordinates
}

export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";
export const CREATE_TRIP = "CREATE_TRIP";
export const CREATE_OBSERVATION = "CREATE_OBSERVATION";
export const SET_OBSERVATION_COORDINATES = "SET_OBSERVATION_COORDINATES";
export const FINISH_OBSERVATION = "FINISH_OBSERVATION";
export const FINISH_TRIP = "FINISH_TRIP";
export const ADD_ROUTE_PATH_COORDINATES = "ADD_ROUTE_PATH_COORDINATES";
