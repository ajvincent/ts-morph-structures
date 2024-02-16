// #region preamble
import fs from "fs/promises";
import path from "path";

import {
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

import runPrettify from "#utilities/source/runPrettify.js";

import {
  stageDir,
} from "./constants.js";

import BuildClassesDriver from "./BuildClassesDriver.js";
import TSDocMap from "./structureMeta/TSDocMap.js";
import reportTSDocsCoverage from "#stage_one/coverage/tsdocs.js";

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

  await BuildClassesDriver(distDir);
  {
    const results = TSDocMap.toJSON();
    await fs.mkdir(path.join(distDir, "coverage"));
    await fs.writeFile(path.join(distDir, "coverage/tsdocs.json"), JSON.stringify(results, null, 2), { encoding: "utf-8" });
    reportTSDocsCoverage(true, results);
  }

  await runPrettify(distDir);
}
