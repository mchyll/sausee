import { Region } from "react-native-maps";

export type RootStackParamList = {
  TripMapScreen: undefined,
  DownloadMapScreen: undefined,
  StartScreen: undefined,
  TestModalScreen: undefined,
  FullScreen: undefined,
  FormScreen: undefined,
  CounterScreen: {
    initialCounter: CounterName,
    showTies: boolean,
  },
  PanResponderTestScreen: undefined
}

export interface Coordinates {
  /** Latitude in degrees */
  latitude: number;
  /** Longitude in degrees */
  longitude: number;
}

export interface SauseeState {
  currentTripId: string | null,
  currentObservation: Observation | null,
  trips: Trip[],
  currentTripOverlayIndex: number, // -1 means not present
}

export interface Trip {
  id: string,
  timestamp: number,
  routePath: Coordinates[],
  observations: {
    [id: string]: Observation
  },
  mapRegion: Region
}

export interface ObservationCounters {
  sheepCountTotal: number,
  blueTieCount?: number,
  greenTieCount?: number,
  yellowTieCount?: number,
  redTieCount?: number,
  missingTieCount?: number,
  whiteGreySheepCount: number,
  brownSheepCount: number,
  blackSheepCount: number,
}

export interface Observation extends ObservationCounters {
  id: string,
  timestamp: number,
  yourCoordinates?: Coordinates,
  sheepCoordinates?: Coordinates,
  isNearForm: boolean,
  // TODO possibly ear tag color
}

export type CounterName = keyof ObservationCounters;
export type ScreenName = keyof RootStackParamList;
