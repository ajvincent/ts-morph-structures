import fs from "fs/promises";
import path from "path";

import {
  pathToModule
} from "#utilities/source/AsyncSpecModules.js";

import readDirsDeep from "#utilities/source/readDirsDeep.js";

import {
  stageDir,
  snapshotDir,
} from "./constants.js";
import { PromiseAllParallel, PromiseAllSequence } from "#utilities/source/PromiseTypes.js";

const previousDist = pathToModule(stageDir, "../stage_1_bootstrap/dist");

export default async function copySnapshot(): Promise<void> {
  await fs.rm(snapshotDir, { recursive: true, force: true });
  await fs.mkdir(snapshotDir, { recursive: true });
  await fs.cp(previousDist, snapshotDir, { recursive: true });

  const bootstrapTargetDir = path.join(snapshotDir, "source/bootstrap");

  const bootstrapSourceDir = pathToModule(stageDir, "bootstrap");
  const { dirs, files } = await readDirsDeep(bootstrapSourceDir);

  await PromiseAllSequence(dirs, async d => {
    const targetDir = d.replace(bootstrapSourceDir, bootstrapTargetDir);
    console.log(targetDir);
    await fs.mkdir(targetDir);
  });

  await PromiseAllParallel(files, async f => {
    let contents = await fs.readFile(f, { encoding: "utf-8" });
    contents = contents.replace(/..\/snapshot\/source\//g, "../");

    const targetPath = f.replace(bootstrapSourceDir, bootstrapTargetDir);
    console.log(targetPath);
    await fs.writeFile(targetPath, contents, { encoding: "utf-8" });
  });
}
