import path from "path";
import fs from "fs/promises";
import url from "url";
import {
  projectDir
} from "#utilities/source/AsyncSpecModules.js";

import {
  PromiseAllParallel,
  PromiseAllSequence,
} from "#utilities/source/PromiseTypes.js";

import {
  runModule
} from "#utilities/source/runModule.js";

import readDirsDeep from "#utilities/source/readDirsDeep.js";

import {
  snapshotDir,
  typingsSnapshotDir
} from "./constants.js";

export default
async function compileTypeDefinitions(): Promise<void>
{
  await fs.rm(typingsSnapshotDir, { force: true, recursive: true });
  await fs.mkdir(typingsSnapshotDir);

  const tsconfigSource = path.join(
    url.fileURLToPath(import.meta.url), "../typings-tsconfig.json"
  );
  const tsconfigTarget = path.join(snapshotDir, "typings-tsconfig.json");

  await fs.copyFile(
    tsconfigSource,
    tsconfigTarget
  );

  try {
    await runModule(
      path.join(projectDir, "node_modules/typescript/bin/tsc"), [
        "--project", tsconfigTarget
      ]
    );

    // the tsc run left behind the .d.ts files we already had
    let { dirs, files } = await readDirsDeep(snapshotDir);
    dirs = dirs.map(d => d.replace(snapshotDir, typingsSnapshotDir));
    files = files.filter(f => f.endsWith(".d.ts"));

    await PromiseAllSequence(dirs, d => fs.mkdir(d, { recursive: true }));
    await PromiseAllParallel(files, f => {
      const target = f.replace(snapshotDir, typingsSnapshotDir);
      return fs.copyFile(f, target)
    });
  }
  finally {
    await fs.rm(tsconfigTarget);
  }
}
