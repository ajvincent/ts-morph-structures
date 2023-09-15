// #region preamble
import fs from "fs/promises";
import path from "path";

import {
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

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

  await fs.mkdir(distDir, { recursive: true });
  await fs.cp(
    pathToModule(stageDir, "source"),
    path.join(distDir, "source"),
    { recursive: true }
  );
}
