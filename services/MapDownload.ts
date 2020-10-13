import * as FileSystem from 'expo-file-system';
import { FileSystemDownloadResult } from 'expo-file-system';


export interface Point {
  x: number;
  y: number;
}

// TODO: Only partially working, fix this
export function estimateDownloadTiles(topLeft: Point, bottomRight: Point, startZoom: number, endZoom: number) {
  const a1 = (bottomRight.x - topLeft.x + 1) * (bottomRight.y - topLeft.y + 1);
  console.log("a1:", a1);
  const n = endZoom - startZoom;
  return a1 * (Math.pow(4, n) - 1) / 3;
}

export async function downloadTiles(topLeft: Point, bottomRight: Point, startZoom: number, endZoom: number) {
  // 1. Finn app directory der bildene skal lagres
  // 2. Loop fra startzoom opp til ogmed 20
  // 3. Finn koordinat til start og end tile på denne zoomlevelen (som er forrige * 2)
  // 4. Loop fra start til end tile og kall API med disse x, y, og z
  console.log("saveTiles start");
  let count = 0;

  for (let zoom = startZoom; zoom <= endZoom; zoom++) {
    console.log("Zoom: " + zoom);
    for (let y = topLeft.y; y <= bottomRight.y; y++) {
      for (let x = topLeft.x; x <= bottomRight.x; x++) {

        const url = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom=${zoom}&x=${x}&y=${y}`;
        await FileSystem.downloadAsync(url, FileSystem.documentDirectory + `z${zoom}_x${x}_y${y}.png`)
          .then((result: FileSystemDownloadResult) => {
            console.log("Finished downloading to ", result.uri);
          })
          .catch(console.error);

        count++;
      }
    }

    topLeft.x = topLeft.x * 2;
    topLeft.y = topLeft.y * 2;
    bottomRight.x = bottomRight.x * 2 + 1;
    bottomRight.y = bottomRight.y * 2 + 1;
    console.log("Count: " + count);
  }

  console.log(`Finished downloading ${count} files`);
}

export async function listDirectoryFiles() {
  let files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? "");
  console.log(files.length + " files: ", files);
}

export async function deleteDirectoryFiles() {
  for (const file of await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? "")) {
    await FileSystem.deleteAsync((FileSystem.documentDirectory ?? "") + "/" + file)
      .then(() => console.log(`Deleted file ${file}`))
      .catch(console.error);
  }
}
