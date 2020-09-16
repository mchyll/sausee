import { LocationData } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as FileSystem from 'expo-file-system';


// TODO: Read maybe existing route locations from file

export let routePath: LocationData[] = [];
export function routeTrackingTask(body: TaskManager.TaskManagerTaskBody) {
  if (body.error) {
    // check `error.message` for more details.
    return;
  }

  let newLocations: LocationData[] = [];
  if ("locations" in body.data) {
    newLocations = (<any>body.data).locations;
  }
  else {
    newLocations = body.data as LocationData[];
  }

  console.log('Received new locations', newLocations);
  routePath.push(...newLocations);
  FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "routeLocations_ID.json", JSON.stringify(routePath));
}
