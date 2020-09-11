import * as FileSystem from 'expo-file-system';

interface Point {
    x: number;
    y: number;
}

export function saveTiles(startPoint: Point, endPoint: Point, startZoom: number) {
    // 1. Finn app directory der bildene skal lagres
    // 2. Loop fra startzoom opp til ogmed 20
    // 3. Finn koordinat til start og end tile på denne zoomlevelen (som er forrige * 2)
    // 4. Loop fra start til end tile og kall API med disse x, y, og z
    console.log("saveTiles start");
    let count = 0;

    let zoomOffset = 2;
    for (let zoom = startZoom; zoom <= 20; zoom++) {
        console.log("Zoom: " + zoom);
        for (let y = startPoint.y; y <= endPoint.y; y++) {
            // console.log("  y: " + y);
            for (let x = startPoint.x; x <= endPoint.x; x++) {
                // console.log("  x: " + x);

                const url = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom=${zoom}&x=${x}&y=${y}`;
                // console.log(url);
                count++;
            }
        }

        [startPoint.x, startPoint.y] = [startPoint.x * 2, startPoint.y * 2];
        [endPoint.x, endPoint.y] = [endPoint.x * 2 + zoomOffset - 1, endPoint.y * 2 + zoomOffset - 1];
        console.log("zoomOffset: " + zoomOffset);
        zoomOffset *= 2;
        console.log("Count: " + count);
    }

    console.log("Count: " + count);
}

export function testDownload() {
    FileSystem.downloadAsync(
        'http://techslides.com/demos/sample-videos/small.mp4',
        FileSystem.documentDirectory + 'small.mp4')
    .then(({ uri }) => {
        console.log('Finished downloading to ', uri);
    })
    .catch(error => {
        console.error(error);
    });
}
