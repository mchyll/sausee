import { Observation, SheepCounterName } from "./TypeDefinitions";


export const AllCounters: SheepCounterName[] = [
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

export const NoTiesCounters: SheepCounterName[] = [
  "sheepCountTotal",
  "whiteGreySheepCount",
  "brownSheepCount",
  "blackSheepCount",
]

export const CounterDescriptions: Record<SheepCounterName, string> = {
  sheepCountTotal: "Totalt manuelt telte sauer",
  whiteGreySheepCount: "Hvitgrå sauer",
  brownSheepCount: "Brune sauer",
  blackSheepCount: "Svarte sauer",
  blueTieCount: "Blå slips",
  greenTieCount: "Grønne slips",
  yellowTieCount: "Gule slips",
  redTieCount: "Røde slips",
  missingTieCount: "Manglende slips"
};

export const CounterSpeechDescriptions: Record<SheepCounterName, [string, string]> = {
  sheepCountTotal: ["sau totalt", "sauer totalt"],
  whiteGreySheepCount: ["hvitgrå sau", "hvitgrå sauer"],
  brownSheepCount: ["brun sau", "brune sauer"],
  blackSheepCount: ["svartt sau", "svartte sauer"],
  blueTieCount: ["blått slips", "blå slips"],
  greenTieCount: ["grønt slips", "grønne slips"],
  yellowTieCount: ["gult slips", "gule slips"],
  redTieCount: ["rødt slips", "røde slips"],
  missingTieCount: ["manglende slips", "manglende slips"]
};

export const getCounterSpeechDescription = (counter: SheepCounterName, count: number) =>
  CounterSpeechDescriptions[counter][count === 1 ? 0 : 1];

export const ObservationTypeDescriptions: Record<Observation["type"], string> = {
  SHEEP: "Sau",
  PREDATOR: "Rovdyr",
  INJURED_SHEEP: "Skadet sau",
  DEAD_SHEEP: "Død sau"
};
