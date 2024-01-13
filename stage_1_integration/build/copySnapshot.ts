import fs from "fs/promises";
import path from "path";

import {
  pathToModule
} from "#utilities/source/AsyncSpecModules.js";

import readDirsDeep from "#utilities/source/readDirsDeep.js";

import {
  PromiseAllParallel,
  PromiseAllSequence
} from "#utilities/source/PromiseTypes.js";

import runPrettify from "#utilities/source/runPrettify.js";

import {
  stageDir,
  snapshotDir,
} from "./constants.js";

const previousDist = pathToModule(stageDir, "../stage_1_bootstrap/dist");

export default async function copySnapshot(): Promise<void> {
  await fs.rm(snapshotDir, { recursive: true, force: true });
  await fs.mkdir(snapshotDir, { recursive: true });
  await fs.cp(previousDist, snapshotDir, { recursive: true });

  await Promise.all([
    copyComponentsDir("bootstrap", "source/bootstrap"),
    copyComponentsDir("toolbox", "source/toolbox"),
  ]);
}

async function copyComponentsDir(
  pathToSourceDir: string,
  pathToTargetDir: string,
): Promise<void>
{
  const sourceDir = pathToModule(stageDir, pathToSourceDir);
  const { dirs, files } = await readDirsDeep(sourceDir);

  const targetDir = path.join(snapshotDir, pathToTargetDir);

  await PromiseAllSequence(dirs, async d => {
    const targetSubDir = d.replace(sourceDir, targetDir);
    await fs.mkdir(targetSubDir);
  });

  await PromiseAllParallel(files, async f => {
    let contents = await fs.readFile(f, { encoding: "utf-8" });
    contents = contents.replace(/..\/snapshot\/source\//g, "../");

    const targetPath = f.replace(sourceDir, targetDir);
    await fs.writeFile(targetPath, contents, { encoding: "utf-8" });
  });

  await runPrettify(targetDir);
}
