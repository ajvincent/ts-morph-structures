import path from "path";
import { spawn } from "child_process";

import {
  Deferred
} from "#utilities/source/PromiseTypes.js";

import {
  pathToModule,
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

import {
  snapshotDir,
  stageDir
} from "./constants.js";

export default async function doBundles(): Promise<void>
{
  const d = new Deferred<void>;
  const rollupLocation = path.join(projectDir, "node_modules/rollup/dist/bin/rollup");
  const pathToConfig = pathToModule(stageDir, "build/rollup.config.js");
  const child = spawn(
    "node",
    [
      rollupLocation,
      "--config",
      pathToConfig,
    ],
    {
      cwd: snapshotDir,
      stdio: ["ignore", "inherit", "inherit", "ipc"],
    }
  );
  child.on('exit', code => code ? d.reject(code) : d.resolve());
  await d.promise;
}
