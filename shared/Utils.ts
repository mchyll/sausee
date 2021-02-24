import { Region } from "react-native-maps";
import { Coordinates } from "./TypeDefinitions";


export function d10(strs: TemplateStringsArray, ...args: (string | number)[]) {
  let result = strs[0];
  for (let i = 0; i < args.length; ++i) {
    const n = args[i];
    if (typeof n === "number") {
      result += Number(n).toFixed(10);
    } else {
      result += n;
    }
    result += strs[i + 1];
  }
  return result;
}

export function getMapZoom(region: Region, viewportWidth: number) {
  return (Math.log2(360 * ((viewportWidth / 256) / region.longitudeDelta)) + 1); // Math.round
}

export function getMapTileForCoords(coords: Coordinates, zoom: number) {
  return {
    x: Math.floor((coords.longitude + 180) / 360 * Math.pow(2, zoom)),
    y: Math.floor((1 - Math.log(Math.tan(coords.latitude * Math.PI / 180) + 1 / Math.cos(coords.latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))
  };
}

export function getFilename(fileUri: string) {
  return fileUri.split("/").pop();
}
