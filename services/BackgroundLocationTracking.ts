import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";
import { Dispatch } from 'react';
import { ActionType } from '../shared/Actions';
import { addRoutePathCoordinates } from '../shared/ActionCreators';


export const ROUTE_TRACKER_TASK_NAME = "RoutePathTracker";

export function createRouteTrackingTask(dispatch: Dispatch<ActionType>) {
  return function routeTrackingTask(body: TaskManager.TaskManagerTaskBody) {
    if (body.error) {
      // check `error.message` for more details.
      return;
    }

    console.log("Received task body:", body);

    let newLocations: any;
    if ("locations" in body.data) {
      newLocations = (<any>body.data).locations;
    }
    else {
      newLocations = body.data;
    }

    // console.log("Received new locations", newLocations);
    for (const loc of newLocations) {
      dispatch(addRoutePathCoordinates({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
    }
  }
}

export async function startRouteTracking() {
  const permission = await Location.requestPermissionsAsync();
  console.log(permission);

  if (permission.granted) {
    if (!await isRouteTracking()) {
      console.log("Trying to start location tracking");

      return Location.startLocationUpdatesAsync(ROUTE_TRACKER_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        foregroundService: {
          notificationTitle: "Henter posisjon title",
          notificationBody: "Henter posisjon body"
        }
      }).catch(error => {
        console.log("Couldn't start tracking:", error);
        if (__DEV__) {
          console.log("Is in development mode, proceeding anyway");
          return Promise.resolve();
        }
        else {
          throw error;
        }
      })
    }
    else {
      console.log("Location tracking already started");
      return Promise.resolve();
    }
  }
  else if (__DEV__) {
    console.log("Location permission was not granted but is in development mode, proceeding anyway");
    return Promise.resolve();
  }
  else {
    console.log("Location permission was not granted");
    return Promise.reject("Location permission was not granted");
  }
}

export function stopRouteTracking() {
  console.log("Stopping location tracking");
  return Location.stopLocationUpdatesAsync(ROUTE_TRACKER_TASK_NAME);
}

export function isRouteTracking() {
  return Location.hasStartedLocationUpdatesAsync(ROUTE_TRACKER_TASK_NAME);
}
