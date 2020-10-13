import * as TaskManager from 'expo-task-manager';
import { Coordinates } from "./shared/TypeDefinitions";
import { Dispatch } from 'react';
import { ActionType } from './shared/Actions';
import { addRoutePathCoordinates } from './shared/ActionCreators';

/*
export async function getLocation() {
  let permission = await Location.getPermissionsAsync();
  if(!permission.granted && permission.canAskAgain) {
    permission = await Location.requestPermissionsAsync();
  }
  if(permission.granted) {
    return Location.getCurrentPositionAsync()
  } else return null;
}
*/

// TODO: Read maybe existing route locations from file

export let routePath: Coordinates[] = [];
export function createRouteTrackingTask(dispatch: Dispatch<ActionType>) {
  return function routeTrackingTask(body: TaskManager.TaskManagerTaskBody) {
    if (body.error) {
      // check `error.message` for more details.
      return;
    }
  
    let newLocations: Coordinates[] = [];
    if ("locations" in body.data) {
      newLocations = (<any>body.data).locations;
    }
    else {
      newLocations = body.data as Coordinates[];
    }
    for (const loc of newLocations) {
      dispatch(addRoutePathCoordinates(loc));
    }
    
    /*
    console.log('Received new locations', newLocations);
    routePath.push(...newLocations);
    FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "routeLocations_ID.json", JSON.stringify(routePath));
    */
  }
}
