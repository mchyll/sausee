import { Region } from "react-native-maps";

export type FormScreenParamList = {
  SheepFormScreen: undefined,
  InjuredSheepFormScreen: undefined,
  DeadSheepFormScreen: undefined
};

export type RootStackParamList = FormScreenParamList & {
  TripMapScreen: undefined,
  DownloadMapScreen: undefined,
  StartScreen: undefined,
  TestModalScreen: undefined,
  FullScreen: undefined,
  FormScreenModals: {
    screen: keyof FormScreenParamList
  },
  CounterScreen: {
    initialCounter: SheepCounterName,
  },
  PanResponderTestScreen: undefined,
  TripsListScreen: undefined,
  OldTripScreen: undefined,
  ReceiptScreen: undefined,
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
  tripOverlayIndex: number, // -1 means not present
  isUsingLocalTiles: boolean,
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

// (Used the Private First (tm)-principle)
export interface ObservationBase {
  id: string,
  timestamp: number,
  yourCoordinates: Coordinates,
  animalCoordinates: Coordinates,
  isNewObservation: boolean,
}

export interface SheepCounters {
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

export interface SheepObservation extends ObservationBase, SheepCounters {
  type: "SHEEP",
  isNearForm: boolean,
  // TODO possibly ear tag color
}

export interface PredatorObservation extends ObservationBase {
  type: "PREDATOR",
  species: string,
  count?: number,
}

export interface InjuredSheepObservation extends ObservationBase {
  type: "INJURED_SHEEP",
  description: string,
  imagePaths: string[]
}

export interface DeadSheepObservation extends ObservationBase {
  type: "DEAD_SHEEP",
  description: string,
  imagePaths: string[]
}

export type Observation = SheepObservation | PredatorObservation | InjuredSheepObservation | DeadSheepObservation;

export type SheepCounterName = keyof SheepCounters;
export type ScreenName = keyof RootStackParamList;
export type FormScreenName = keyof FormScreenParamList;