import * as FileSystem from 'expo-file-system';


export interface Point {
  x: number;
  y: number;
}

export interface DownloadProgress {
  filesDownloaded: number;
  totalFilesToDownload: number;
  progress: number;
}

export type DownloadProgressListener = (progress: DownloadProgress) => void;

export interface ListenerSubscription {
  unsubscribe: () => void;
}

export interface IMapDownloadTask {
  cancelDownload(): void;
  addProgressListener(listener: DownloadProgressListener): ListenerSubscription;
  startDownloadAsync(): Promise<boolean>;
}



// Now completly working. No fix needed ;)
export function estimateDownloadTiles(topLeft: Point, bottomRight: Point, startZoom: number, endZoom: number) {
  const a1 = (bottomRight.x - topLeft.x + 1) * (bottomRight.y - topLeft.y + 1);
  // console.log("a1:", a1);
  const n = Math.floor(endZoom) - startZoom + 1;
  return a1 * (Math.pow(4, n) - 1) / 3;
}

export function estimateDownloadTilesSize(topLeft: Point, bottomRight: Point, startZoom: number, endZoom: number) {
  const numTiles = estimateDownloadTiles(topLeft, bottomRight, startZoom, endZoom);
  let estimatedSize = numTiles * 35000;

  const units = ["bytes", "KB", "MB", "GB", "TB"];
  let u = 0;
  while (estimatedSize >= 1000 && u < units.length - 1) {
    estimatedSize /= 1000;
    u++;
  }

  return `${estimatedSize.toFixed(1)} ${units[u]}`;
}

// FileSystem.documentDirectory only returns null on the web (which we do not support): https://github.com/expo/expo/issues/5558
export const tilesDirectoryPath = FileSystem.documentDirectory! + "tiles/";

export const tileTemplateWithPath = tilesDirectoryPath + "z{z}_x{x}_y{y}.png";

async function createTilesDirectoryAsync() {
  return FileSystem.makeDirectoryAsync(tilesDirectoryPath);
}

async function ensureTilesDirectoryExistsAsync() {
  const dirInfo = await FileSystem.getInfoAsync(tilesDirectoryPath);
  if (!dirInfo.exists) {
    console.log("Tiles directory doesn't exist, creating...");
    await createTilesDirectoryAsync();
  }
}

export async function listDownloadedTiles() {
  await ensureTilesDirectoryExistsAsync();
  let files = await FileSystem.readDirectoryAsync(tilesDirectoryPath);
  console.log(files.length + " files: ", files);
}

export async function deleteDownloadedTiles() {
  await ensureTilesDirectoryExistsAsync();
  const tilesDirectory = await FileSystem.readDirectoryAsync(tilesDirectoryPath);
  for (const file of tilesDirectory) {
    await FileSystem.deleteAsync(tilesDirectoryPath + file)
      .then(() => console.log(`Deleted file ${file}`))
      .catch(console.error);
  }
}

export function createMapDownloadTask(topLeft: Point, bottomRight: Point, startZoom: number, endZoom: number): IMapDownloadTask {
  return new MapDownloadTask(topLeft, bottomRight, startZoom, endZoom);
  //return new MockMapDownloadTask();
}



abstract class MapDownloadTaskBase implements IMapDownloadTask {
  protected progressListeners: DownloadProgressListener[];
  protected cancelRequested: boolean;

  constructor() {
    this.progressListeners = [];
    this.cancelRequested = false;
  }

  cancelDownload() {
    this.cancelRequested = true;
  }

  addProgressListener(listener: DownloadProgressListener): ListenerSubscription {
    this.progressListeners.push(listener);
    return {
      unsubscribe: () => {
        this.progressListeners = this.progressListeners.filter(l => l !== listener);
      }
    };
  }

  protected notifyProgressListeners(progress: DownloadProgress) {
    this.progressListeners.forEach(listener => listener(progress));
  }

  abstract startDownloadAsync(): Promise<boolean>;
}

class MockMapDownloadTask extends MapDownloadTaskBase {
  private progress(progress: number) {
    const totalFiles = 1000;
    this.notifyProgressListeners({
      filesDownloaded: progress * totalFiles,
      progress,
      totalFilesToDownload: totalFiles
    });
  }

  async startDownloadAsync() {
    const delay = (delayMs: number) => new Promise(resolve => setTimeout(resolve, delayMs));
    // Pairwise delay in ms and progress value
    const realisticProgress = [
      100, 0.05,
      800, 0.1,
      700, 0.2,
      600, 0.25,
      700, 0.35,
      900, 0.5,
      700, 0.6,
      500, 0.65,
      600, 0.7,
      700, 0.8,
      600, 0.85,
      700, 0.95,
      1500, 1
    ];
    const progress = [
      100, 0.10,
      // 500, 0.20,
      // 500, 0.30,
      // 500, 0.40,
      // 500, 0.50,
      // 500, 0.60,
      // 500, 0.70,
      // 500, 0.80,
      // 500, 0.90,
      500, 1
    ];
    for (let i = 0; i < progress.length; i += 2) {
      if (this.cancelRequested) {
        return false;
      }
      console.log(`MockMapDownloadTask: Waiting ${progress[i]} ms before setting progress to ${progress[i + 1]}`);
      await delay(progress[i]);
      this.progress(progress[i + 1]);
    }
    return true;
  }
}

class MapDownloadTask extends MapDownloadTaskBase {
  private readonly mapTiles: [string, string][];
  private count;
  private workersWork: { "https://opencache.statkart.no": number, "https://opencache2.statkart.no": number, "https://opencache3.statkart.no": number };
  private actualNumberOfTiles;


  constructor(private topLeft: Point, private bottomRight: Point, private startZoom: number, private endZoom: number) {
    super();
    this.mapTiles = []
    this.count = 0;
    this.workersWork = { "https://opencache.statkart.no": 0, "https://opencache2.statkart.no": 0, "https://opencache3.statkart.no": 0 };
    this.actualNumberOfTiles = 0;
  }

  async startDownloadAsync() {
    console.log("MapDownloadTask.startDownloadAsync start");
    await ensureTilesDirectoryExistsAsync();


    let topLeft = { ...this.topLeft };
    let bottomRight = { ...this.bottomRight };

    const t0 = performance.now();
    for (let zoom = this.startZoom; zoom <= this.endZoom; zoom++) {
      console.log("Zoom: " + zoom);
      for (let y = topLeft.y; y <= bottomRight.y; y++) {
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
          const fileNameWithPath = tilesDirectoryPath + `z${zoom}_x${x}_y${y}.png`;
          const result = await FileSystem.getInfoAsync(fileNameWithPath);//.readAsStringAsync(fileNameWithPath, { encoding: FileSystem.EncodingType.Base64, length: 1 });
          if (result.exists === true) console.log(`Skipping maptile because it is already downloaded: ${fileNameWithPath}`);
          else this.mapTiles.push([`/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom=${zoom}&x=${x}&y=${y}`, fileNameWithPath]);
        }
      }
      topLeft.x = topLeft.x * 2;
      topLeft.y = topLeft.y * 2;
      bottomRight.x = bottomRight.x * 2 + 1;
      bottomRight.y = bottomRight.y * 2 + 1;
    }

    this.actualNumberOfTiles = this.mapTiles.length;
    console.log("Actual number of tiles: ", this.actualNumberOfTiles);
    const results = await Promise.all(
      [
        this.worker("https://opencache.statkart.no"),
        this.worker("https://opencache2.statkart.no"),
        this.worker("https://opencache3.statkart.no"),
      ]
    );
    const t1 = performance.now();
    console.log(`Downloading ${this.actualNumberOfTiles} files took ${t1 - t0} milliseconds.`);
    console.log(`Wokers: ${this.workersWork['https://opencache.statkart.no']} ${this.workersWork['https://opencache2.statkart.no']} ${this.workersWork['https://opencache3.statkart.no']}`);

    if (!results[0]
      || !results[1]
      || !results[2]
    ) return false;

    let progress;
    if (this.actualNumberOfTiles === 0)
      progress = 1
    else
      progress = this.count / this.actualNumberOfTiles;
    this.notifyProgressListeners({
      filesDownloaded: this.count,
      progress: progress,
      totalFilesToDownload: this.actualNumberOfTiles,
    });
    console.log(`Finished downloading ${this.count} files`);
    return true;
  }

  async worker(hostName: "https://opencache.statkart.no" | "https://opencache2.statkart.no" | "https://opencache3.statkart.no") {
    let inOut;
    while (inOut = this.mapTiles.pop()) {
      this.workersWork[hostName] += 1;
      const fullURL = hostName + inOut[0];
      try {
        const result = await FileSystem.downloadAsync(fullURL, inOut[1]);
        console.log(`Finished downloading to ${result.uri}`);
      } catch (e) {
        console.error(e);
      }

      if (this.count % 10 === 0) {
        this.notifyProgressListeners({
          filesDownloaded: this.count,
          progress: this.count / this.actualNumberOfTiles,
          totalFilesToDownload: this.actualNumberOfTiles,
        });
      }

      if (this.cancelRequested) {
        return false;
      }

      this.count++;
    }
    return true;
  }
}

// zoomen i dms lik hver gang
// ta tiden med og uten parallellisering
// sjekke hvor mye overhead pop() har?
// telle hvilken worker som er mest motivert 💪 

/*
for (let zoom = this.startZoom; zoom <= this.endZoom; zoom++) {
      console.log("Zoom: " + zoom);
      for (let y = topLeft.y; y <= bottomRight.y; y++) {
        for (let x = topLeft.x; x <= bottomRight.x; x++) {

          const url = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom=${zoom}&x=${x}&y=${y}`;
          try {
            const result = await FileSystem.downloadAsync(url, getTilesDirectoryPath() + `z${zoom}_x${x}_y${y}.png`);
            console.log(`Finished downloading to ${result.uri}`);
          } catch (e) {
            console.error(e);
          }

          if (count % 10 === 0) {
            this.notifyProgressListeners({
              filesDownloaded: count,
              progress: count / this.totalFiles,
              totalFilesToDownload: this.totalFiles
            });
          }

          if (this.cancelRequested) {
            return false;
          }

          count++;
        }
      }

      topLeft.x = topLeft.x * 2;
      topLeft.y = topLeft.y * 2;
      bottomRight.x = bottomRight.x * 2 + 1;
      bottomRight.y = bottomRight.y * 2 + 1;
      console.log("Count: " + count);
    }

*/