const initState = {
  currentTrip: "GUID lol",
  currentObservation: "GUID",
  trips: [
    {
      id: "GUID lol",
      timestamp: "dato",
      routePath: [
        { lat: 63.0, lon: 10.2 },
        { lat: 63.0, lon: 10.2 }
      ],
      observations: [
        {
          id: "GUID",
          timestamp: "tid og dato",
          yourCoordinates: { lat: 63.0, lon: 10.2 },
          sheepCoordinates: { lat: 63.0, lon: 10.2 },
          sheepCountTotal: 12,
          eweCount: 4,    // nullable
          lambCount: 8,   // nullable
          blueTieCount: 0, // nullable
          greenTieCount: 0, // nullable
          yellowTieCount: 0, // nullable
          redTieCount: 0, // nullable
          missingTieCount: 0, // nullable
          whiteSheepCount: 1,
          graySheepCount: 1,
          brownSheepCount: 1,
          blackSheepCount: 1,
          blackHeadSheepCount: 1,
          // possibly ear tag color
        }
      ]
    }
  ]
}

export function rootReducer(state = initState, action: any) {

}