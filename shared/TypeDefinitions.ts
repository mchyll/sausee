export type RootStackParamList = {
  FormScreen: undefined,
  CounterScreen: CounterNameList,
  TripMapScreen: undefined
}

export interface CounterNameList {
  initCounterIndex: number,
  counterNames: CounterName[],
}

export interface Coordinates {
  lat: number;
  lon: number;
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
  eweCount?: number,
  lambCount?: number,
  blueTieCount?: number,
  greenTieCount?: number,
  yellowTieCount?: number,
  redTieCount?: number,
  missingTieCount?: number,
  whiteSheepCount: number,
  graySheepCount: number,
  brownSheepCount: number,
  blackSheepCount: number,
  blackHeadSheepCount: number
}

export interface Observation extends ObservationCounters {
  id: string,
  timestamp: number,
  yourCoordinates?: Coordinates,
  sheepCoordinates?: Coordinates
  // TODO possibly ear tag color
}

export type CounterName = keyof ObservationCounters;
