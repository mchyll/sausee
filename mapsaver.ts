import * as FileSystem from 'expo-file-system';
import { Point } from 'react-native-maps';


export function saveTiles(startPoint: Point, endPoint: Point, startZoom: number, endZoom: number) {
    // 1. Finn app directory der bildene skal lagres
    // 2. Loop fra startzoom opp til ogmed 20
    // 3. Finn koordinat til start og end tile på denne zoomlevelen (som er forrige * 2)
    // 4. Loop fra start til end tile og kall API med disse x, y, og z
    console.log("saveTiles start");
    let count = 0;

    const zoomOffset = 1;
    for (let zoom = startZoom; zoom <= endZoom; zoom++) {
        console.log("Zoom: " + zoom);
        for (let y = startPoint.y; y <= endPoint.y; y++) {
            // console.log("  y: " + y);
            for (let x = startPoint.x; x <= endPoint.x; x++) {
                // console.log("  x: " + x);

                const url = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom=${zoom}&x=${x}&y=${y}`;
                // console.log(url);
                FileSystem.downloadAsync(url, FileSystem.documentDirectory + `z${zoom}_x${x}_y${y}.png`)
                    .then(({ uri }) => {
                        console.log('Finished downloading to ', uri);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                count++;
            }
        }

        [startPoint.x, startPoint.y] = [startPoint.x * 2, startPoint.y * 2];
        [endPoint.x, endPoint.y] = [endPoint.x * 2 + zoomOffset, endPoint.y * 2 + zoomOffset];
        console.log("Count: " + count);
    }

    console.log("Finished downloading");
}

export async function listDirectoryFiles() {
    let files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? "");
    console.log(files.length + " files: ", files);
}

export async function deleteDirectoryFiles() {
    let files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? "");
    files.forEach(async file => {
        await FileSystem.deleteAsync((FileSystem.documentDirectory ?? "") + "/" + file)
            .then(() => console.log(`Deleted file ${file}`)).catch(err => console.error("OH NO: " + err));
    });
}
