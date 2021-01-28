import { Action } from "redux";
import { CounterName, Coordinates } from "./TypeDefinitions";


export const CHANGE_COUNTER = "CHANGE_COUNTER";
export const CREATE_TRIP = "CREATE_TRIP";
export const BEGIN_OBSERVATION = "BEGIN_OBSERVATION";
export const CANCEL_OBSERVATION = "CANCEL_OBSERVATION";
export const DELETE_OBSERVATION = "DELETE_OBSERVATION";
export const FINISH_OBSERVATION = "FINISH_OBSERVATION";
export const FINISH_TRIP = "FINISH_TRIP";
export const ADD_ROUTE_PATH_COORDINATES = "ADD_ROUTE_PATH_COORDINATES";
export const SET_CURRENT_OBSERVATION = "SET_CURRENT_OBSERVATION";
export const SET_PREVIOUS_TRIP_OVERLAY_INDEX = "SET_PREVIOUS_TRIP_OVERLAY_INDEX";
export const SET_IS_NEAR_FORM = "SET_IS_NEAR_FORM";

interface ActionWithPayload<T, P> extends Action<T> {
  payload: P
}

type ChangeCounterAction = ActionWithPayload<typeof CHANGE_COUNTER, {
  counterName: CounterName,
  change: number,
}>
type CreateTripAction = ActionWithPayload<typeof CREATE_TRIP, null>
type BeginObservationAction = ActionWithPayload<typeof BEGIN_OBSERVATION, {
  yourCoordinates?: Coordinates,
  sheepCoordinates?: Coordinates
}>
type CancelObservation = ActionWithPayload<typeof CANCEL_OBSERVATION, null>
type DeleteObservation = ActionWithPayload<typeof DELETE_OBSERVATION, null>
type FinishObservationAction = ActionWithPayload<typeof FINISH_OBSERVATION, {
  yourCoordinates?: Coordinates,
  sheepCoordinates?: Coordinates
}>
type FinishTripAction = ActionWithPayload<typeof FINISH_TRIP, null>
type AddRoutePathCoordinatesAction = ActionWithPayload<typeof ADD_ROUTE_PATH_COORDINATES, {
  coordinates: Coordinates
}>
type SetCurrentObservation = ActionWithPayload<typeof SET_CURRENT_OBSERVATION, {
  observationId: string
}>
type SetPreviousTripOverlayIndex = ActionWithPayload<typeof SET_PREVIOUS_TRIP_OVERLAY_INDEX, {
  tripId: number
}>
type SetIsNearFrom = ActionWithPayload<typeof SET_IS_NEAR_FORM, {
  isNearForm: boolean,
}>

export type ActionType = ChangeCounterAction | CreateTripAction | BeginObservationAction | FinishObservationAction | FinishTripAction | AddRoutePathCoordinatesAction | CancelObservation | SetCurrentObservation | DeleteObservation | SetPreviousTripOverlayIndex | SetIsNearFrom;
