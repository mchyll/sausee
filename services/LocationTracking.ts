import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";
import { Dispatch } from 'react';
import { ActionType } from '../shared/Actions';
import { addRoutePathCoordinates } from '../shared/ActionCreators';
import { Coordinates } from '../shared/TypeDefinitions';
import { Alert } from 'react-native';


export const BACKROUND_ROUTE_TRACKER_TASK_NAME = "RoutePathTracker";

let dispatch: Dispatch<ActionType> | undefined;
let foregroundTrackingEnabled = false;
let lastForegroundLocationTime = 0;

// foreground tracking is called directly, not by any task
export function foregroundTracker(coordinates: Coordinates) {
  const timeNow = new Date().getTime();
  if (foregroundTrackingEnabled && dispatch && timeNow - lastForegroundLocationTime > 30000) {
    lastForegroundLocationTime = timeNow;
    dispatch(addRoutePathCoordinates({ latitude: coordinates.latitude, longitude: coordinates.longitude }));
  }
}

export function createBackgroundRouteTrackingTask(_dispatch: Dispatch<ActionType>) {
  dispatch = _dispatch;

  return function backgroundRouteTrackingTask(body: TaskManager.TaskManagerTaskBody) {
    if (body.error) {
      // check `error.message` for more details.
      return;
    }

    let newLocations: any;
    if ("locations" in body.data) {
      newLocations = (<any>body.data).locations;
    }
    else {
      newLocations = body.data;
    }

    for (const loc of newLocations) {
      if (dispatch) {
        dispatch(addRoutePathCoordinates({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }));
      }
    }
  }
}

export async function startRouteTracking() {


  const permission = await Location.requestPermissionsAsync();

  if (permission.granted) {
    console.log("Enabling foreground tracking");
    foregroundTrackingEnabled = true;
    /*
    if (!await isBackgroundRouteTracking()) {

      console.log("Trying to start background location tracking");

      try {
        return await Location.startLocationUpdatesAsync(BACKROUND_ROUTE_TRACKER_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          foregroundService: {
            notificationTitle: "Henter posisjon title",
            notificationBody: "Henter posisjon body"
          }
        })
      }
      catch (error) {
        console.log("Couldn't start background tracking:", error.message);
        console.log("Enabling foreground tracking instead");
        foregroundTrackingEnabled = true;
      }
    }
    else {
      console.log("Background location tracking already started");
    }
    */
  }
  else {
    console.log("Location permission was not granted but proceeding anyway");
    Alert.alert("Posisjonstillatelser kreves", "Vi trenger tillatelse til å se posisjonen din for at appen skal kunne registrere hvor du går under oppsynsturen. Du kan gjøre dette i Innstillinger-appen.");
  }
}

export async function stopRouteTracking() {
  if (foregroundTrackingEnabled) {
    console.log("Disabling foreground location tracking");
    foregroundTrackingEnabled = false;
    lastForegroundLocationTime = 0;
  }
  else if (await isBackgroundRouteTracking()) {
    console.log("Stopping background location tracking");
    try {
      return await Location.stopLocationUpdatesAsync(BACKROUND_ROUTE_TRACKER_TASK_NAME);
    }
    catch (error) {
      console.log("Couldn't stop background location tracking:", error.message);
    }
  }
}

export async function isBackgroundRouteTracking() {
  try {
    return await Location.hasStartedLocationUpdatesAsync(BACKROUND_ROUTE_TRACKER_TASK_NAME);
  }
  catch (error) {
    console.log("Couldn't check if background location tracking is started:", error.message);
    return false;
  }
}
