import path from "path";
import fs from "fs/promises";
import url from "url";
import {
  projectDir
} from "#utilities/source/AsyncSpecModules.js";

import {
  runModule
} from "#utilities/source/runModule.js";

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
  }
  finally {
    await fs.rm(tsconfigTarget);
  }
}
