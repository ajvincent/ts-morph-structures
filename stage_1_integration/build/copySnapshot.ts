import fs from "fs/promises";

import {
  pathToModule
} from "#utilities/source/AsyncSpecModules.js";

import {
  stageDir,
  snapshotDir,
} from "./constants.js";

const previousDist = pathToModule(stageDir, "../stage_1_bootstrap/dist");

export default async function copySnapshot(): Promise<void> {
  await Promise.all([
    fs.rm(snapshotDir, { recursive: true, force: true }),
  ]);

  await Promise.all([
    fs.mkdir(snapshotDir, { recursive: true }),
  ]);

  await Promise.all([
    fs.cp(previousDist, snapshotDir, { recursive: true }),
  ]);
}
