export type RootStackParamList = {
  FormScreen: undefined,
  CounterScreen: CounterNameList,
  TripMapScreen: undefined,
  DownloadMapScreen: undefined
}

export interface CounterNameList {
  initCounterIndex: number,
  counterNames: CounterName[],
}

export interface Coordinates {
  /** Latitude in degrees */
  latitude: number;
  /** Longitude in degrees */
  longitude: number;
}

export interface SauseeState {
  currentTripId: string | null,
  currentObservationId: string | null,
  trips: Trip[]
}

export interface Trip {
  id: string,
  timestamp: number,
  routePath: Coordinates[],
  observations: Observation[]
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
  sheepCoordinates?: Coordinates
  // TODO possibly ear tag color
}

export type CounterName = keyof ObservationCounters;
export type ScreenName = keyof RootStackParamList;
