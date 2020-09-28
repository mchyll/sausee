import { Action } from "redux";
import { CounterNames, Coordinates } from "./TypeDefinitions";


export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";
export const CREATE_TRIP = "CREATE_TRIP";
export const CREATE_OBSERVATION = "CREATE_OBSERVATION";
export const SET_OBSERVATION_COORDINATES = "SET_OBSERVATION_COORDINATES";
export const FINISH_OBSERVATION = "FINISH_OBSERVATION";
export const FINISH_TRIP = "FINISH_TRIP";
export const ADD_ROUTE_PATH_COORDINATES = "ADD_ROUTE_PATH_COORDINATES";

interface ActionWithPayload<T, P> extends Action<T> {
  payload: P
}

type IncrementCounterAction = ActionWithPayload<typeof INCREMENT_COUNTER, {
  counterName: CounterNames
}>
type DecrementCounterAction = ActionWithPayload<typeof DECREMENT_COUNTER, {
  counterName: CounterNames
}>
type CreateTripAction = ActionWithPayload<typeof CREATE_TRIP, null>
type CreateObservationAction = ActionWithPayload<typeof CREATE_OBSERVATION, null>
type SetObservationCoordinatesAction = ActionWithPayload<typeof SET_OBSERVATION_COORDINATES, {
  yourCoordinates: Coordinates,
  sheepCoordinates: Coordinates
}>
type FinishObservationAction = ActionWithPayload<typeof FINISH_OBSERVATION, null>
type FinishTripAction = ActionWithPayload<typeof FINISH_TRIP, null>
type AddRoutePathCoordinatesAction = ActionWithPayload<typeof ADD_ROUTE_PATH_COORDINATES, {
  coordinates: Coordinates
}>

export type ActionType = IncrementCounterAction | DecrementCounterAction | CreateTripAction | CreateObservationAction | SetObservationCoordinatesAction | FinishObservationAction | FinishTripAction | AddRoutePathCoordinatesAction;
