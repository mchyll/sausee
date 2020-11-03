export type RootStackParamList = {
  FormScreen: undefined,
  CounterScreen: CounterNameList,
  TripMapScreen: undefined,
  DownloadMapScreen: undefined,
  StartScreen: undefined,
  TestModalScreen: undefined,
  FullScreen: undefined,
  NewFormScreen: {
    initialNearForm: boolean
  },
  NewCounterScreen: {
    initialCounter: CounterName
  }
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
  currentObservation: Observation | null,
  trips: Trip[]
}

export interface Trip {
  id: string,
  timestamp: number,
  routePath: Coordinates[],
  observations: {
    [id: string]: Observation
  }
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
