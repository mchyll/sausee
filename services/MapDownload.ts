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



// TODO: Only partially working, fix this
export function estimateDownloadTiles(topLeft: Point, bottomRight: Point, startZoom: number, endZoom: number) {
  const a1 = (bottomRight.x - topLeft.x + 1) * (bottomRight.y - topLeft.y + 1);
  // console.log("a1:", a1);
  const n = endZoom - startZoom + 1;
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

export function createMapDownloadTask(topLeft: Point, bottomRight: Point, startZoom: number, endZoom: number): IMapDownloadTask {
  return new MapDownloadTask(topLeft, bottomRight, startZoom, endZoom);
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
    const _progress = [
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
      500, 0.20,
      500, 0.30,
      500, 0.40,
      500, 0.50,
      500, 0.60,
      500, 0.70,
      500, 0.80,
      500, 0.90,
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
  private totalFiles: number;

  constructor(private topLeft: Point, private bottomRight: Point, private startZoom: number, private endZoom: number) {
    super();
    this.totalFiles = estimateDownloadTiles(topLeft, bottomRight, startZoom, endZoom);
  }

  async startDownloadAsync() {
    console.log("MapDownloadTask.startDownloadAsync start");

    let count = 0;
    let topLeft = { ...this.topLeft };
    let bottomRight = { ...this.bottomRight };
    const t0 = performance.now();
    for (let zoom = this.startZoom; zoom <= this.endZoom; zoom++) {
      console.log("Zoom: " + zoom);
      for (let y = topLeft.y; y <= bottomRight.y; y++) {
        for (let x = topLeft.x; x <= bottomRight.x; x++) {

          const url = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom=${zoom}&x=${x}&y=${y}`;
          
          try {
            const result = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + `z${zoom}_x${x}_y${y}.png`);
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
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    this.notifyProgressListeners({
      filesDownloaded: count,
      progress: count / this.totalFiles,
      totalFilesToDownload: this.totalFiles
    });
    console.log(`Finished downloading ${count} files`);
    return true;
  }
}
