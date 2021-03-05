import { Region } from "react-native-maps";
import { Action } from "redux";
import { SheepCounterName, Coordinates, Observation } from "./TypeDefinitions";


export const CHANGE_COUNTER = "CHANGE_COUNTER";
export const CREATE_TRIP = "CREATE_TRIP";
export const BEGIN_OBSERVATION = "BEGIN_OBSERVATION";
export const CANCEL_OBSERVATION = "CANCEL_OBSERVATION";
export const DELETE_OBSERVATION = "DELETE_OBSERVATION";
export const FINISH_OBSERVATION = "FINISH_OBSERVATION";
export const FINISH_TRIP = "FINISH_TRIP";
export const ADD_ROUTE_PATH_COORDINATES = "ADD_ROUTE_PATH_COORDINATES";
export const SET_CURRENT_OBSERVATION = "SET_CURRENT_OBSERVATION";
export const SET_TRIP_OVERLAY_INDEX = "SET_TRIP_OVERLAY_INDEX";
export const SET_IS_NEAR_FORM = "SET_IS_NEAR_FORM";
export const SET_CURRENT_TRIP_ID = "SET_CURRENT_TRIP_ID";
export const SET_PREDATOR_SPECIES = "SET_PREDATOR_SPECIES";
export const SET_PREDATOR_COUNT = "SET_PREDATOR_COUNT";
export const ADD_OBSERVATION_PHOTO = "ADD_OBSERVATION_PHOTO";
export const REMOVE_OBSERVATION_PHOTO = "REMOVE_OBSERVATION_PHOTO";
export const CHANGE_OBSERVATION_DESCRIPTION = "CHANGE_OBSERVATION_DESCRIPTION";
export const SET_USE_LOCAL_TILES = "SET_USE_LOCAL_TILES";
export const RESET_STATE = "RESET_STATE";

interface ActionWithPayload<T, P> extends Action<T> {
  payload: P
}

type ChangeCounterAction = ActionWithPayload<typeof CHANGE_COUNTER, {
  counterName: SheepCounterName,
  change: number,
}>
type CreateTripAction = ActionWithPayload<typeof CREATE_TRIP, {
  mapRegion: Region
}>
type BeginObservationAction = ActionWithPayload<typeof BEGIN_OBSERVATION, {
  type: Observation["type"],
  yourCoordinates: Coordinates,
  animalCoordinates: Coordinates
}>
type CancelObservation = ActionWithPayload<typeof CANCEL_OBSERVATION, null>
type DeleteObservation = ActionWithPayload<typeof DELETE_OBSERVATION, null>
type FinishObservationAction = ActionWithPayload<typeof FINISH_OBSERVATION, null>
type FinishTripAction = ActionWithPayload<typeof FINISH_TRIP, null>
type AddRoutePathCoordinatesAction = ActionWithPayload<typeof ADD_ROUTE_PATH_COORDINATES, {
  coordinates: Coordinates
}>
type SetCurrentObservation = ActionWithPayload<typeof SET_CURRENT_OBSERVATION, {
  observationId: string,
  tripId?: string
}>
type SetTripOverlayIndex = ActionWithPayload<typeof SET_TRIP_OVERLAY_INDEX, {
  tripIndex: number
}>
type SetIsNearFrom = ActionWithPayload<typeof SET_IS_NEAR_FORM, {
  isNearForm: boolean,
}>
type SetCurrentTripId = ActionWithPayload<typeof SET_CURRENT_TRIP_ID, {
  tripId: string
}>
type SetPredatorSpecies = ActionWithPayload<typeof SET_PREDATOR_SPECIES, {
  species: string
}>
type SetPredatorCount = ActionWithPayload<typeof SET_PREDATOR_COUNT, {
  count: number
}>

type AddObservationPhoto = ActionWithPayload<typeof ADD_OBSERVATION_PHOTO, {
  imageUri: string
}>
type RemoveObservationPhoto = ActionWithPayload<typeof REMOVE_OBSERVATION_PHOTO, {
  imageUri: string
}>
type ChangeObservationDescription = ActionWithPayload<typeof CHANGE_OBSERVATION_DESCRIPTION, {
  description: string
}>
type SetUseLocalTiles = ActionWithPayload<typeof SET_USE_LOCAL_TILES, {
  use: boolean
}>
type ResetState = ActionWithPayload<typeof RESET_STATE, null>

export type ActionType =
  ChangeCounterAction | CreateTripAction | BeginObservationAction
  | FinishObservationAction | FinishTripAction | AddRoutePathCoordinatesAction
  | CancelObservation | SetCurrentObservation | DeleteObservation
  | SetTripOverlayIndex | SetIsNearFrom | SetCurrentTripId | SetUseLocalTiles
  | AddObservationPhoto | RemoveObservationPhoto | ChangeObservationDescription
  | SetPredatorSpecies | SetPredatorCount | ResetState;
