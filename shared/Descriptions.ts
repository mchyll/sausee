import { CounterName } from "./TypeDefinitions";


export const AllCounters: CounterName[] = [
  "sheepCountTotal",
  "whiteGreySheepCount",
  "brownSheepCount",
  "blackSheepCount",
  "blueTieCount",
  "greenTieCount",
  "yellowTieCount",
  "redTieCount",
  "missingTieCount"
];

export const CounterDescriptions: Record<CounterName, string> = {
  sheepCountTotal: "Antall sauer totalt",
  whiteGreySheepCount: "Hvitgrå sauer",
  brownSheepCount: "Brune sauer",
  blackSheepCount: "Svarte sauer",
  blueTieCount: "Blå slips",
  greenTieCount: "Grønne slips",
  yellowTieCount: "Gule slips",
  redTieCount: "Røde slips",
  missingTieCount: "Manglende slips"
};
