export type RootStackParamList = {
  FormScreen: CounterList,
  CounterScreen: CounterList
}

interface SwipeCounterSpecification {
  name: string,
  count: number,
}

interface CounterList {
  counters: SwipeCounterSpecification[],
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface AppState {
  currentTrip: string, // TODO maybe change to GUID or UUID type
  currentObservation: string,
  trips: Trip[]
}

export interface Trip {
  id: string,
  timestamp: number, // TODO maybe a more explicit type
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
  yourCoordinates: Coordinates,
  sheepCoordinates: Coordinates
  // TODO possibly ear tag color
}

export type CounterNames = keyof ObservationCounters;
