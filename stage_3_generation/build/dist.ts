// #region preamble
import fs from "fs/promises";

import {
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

import BaseModule from "../moduleClasses/BaseModule.js";
import defineExistingExports from "./publicAndInternalExports.js";
import fillStructureUnions from "./structureUnions.js";

import {
  stageDir,
} from "./constants.js";

const distDir = pathToModule(stageDir, "dist");

// #endregion preamble

async function cleanDist(): Promise<void>
{
  let found = false;
  try {
    await fs.access(distDir);
    found = true;
  }
  catch {
    // do nothing
  }
  if (found)
    await fs.rm(distDir, { recursive: true });
}

export default async function buildDist(): Promise<void>
{
  await cleanDist();
  await fs.mkdir(distDir);

  await Promise.all([
    defineExistingExports(),
    fillStructureUnions(),
  ]);

  await BaseModule.saveExports();
}
