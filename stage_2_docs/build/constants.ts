import {
  type ModuleSourceDirectory,
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

const stageDir: ModuleSourceDirectory = {
  importMeta: import.meta,
  pathToDirectory: "../.."
};

const snapshotDir = pathToModule(stageDir, "snapshot");
const distSnapshotDir = pathToModule(stageDir, "dist");

export {
  stageDir,
  snapshotDir,
  distSnapshotDir,
};
