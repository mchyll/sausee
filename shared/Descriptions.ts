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

export const NoTiesCounters: CounterName[] = [
  "sheepCountTotal",
  "whiteGreySheepCount",
  "brownSheepCount",
  "blackSheepCount",
]

export const CounterDescriptions: Record<CounterName, string> = {
  sheepCountTotal: "Totalt manuelt registrerte sauer",
  whiteGreySheepCount: "Hvitgrå sauer",
  brownSheepCount: "Brune sauer",
  blackSheepCount: "Svarte sauer",
  blueTieCount: "Blå slips",
  greenTieCount: "Grønne slips",
  yellowTieCount: "Gule slips",
  redTieCount: "Røde slips",
  missingTieCount: "Manglende slips"
};

export const CounterSpeechDescriptions: Record<CounterName, [string, string]> = {
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

export const getCounterSpeechDescription = (counter: CounterName, count: number) =>
  CounterSpeechDescriptions[counter][count === 1 ? 0 : 1];
