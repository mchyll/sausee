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

export type CounterNames = "sheepCountTotal" | "eweCount" | "lambCount" | "blueTieCount" | "greenTieCount" | "yellowTieCount" | "redTieCount" | "missingTieCount" | "whiteSheepCount" | "graySheepCount" | "brownSheepCount" | "blackSheepCount" | "blackHeadSheepCount";
