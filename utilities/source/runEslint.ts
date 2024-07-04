import path from "node:path";
import {
  execPath,
} from "node:process";

import {
  spawn
} from "node:child_process";

import {
  Deferred
} from "./PromiseTypes.js";

import {
  projectDir
} from "./AsyncSpecModules.js";

export default async function runESLint(
  cwd: string,
  files: string[]
): Promise<void>
{
  const args: string[] = [
    path.join(projectDir, "node_modules/eslint/bin/eslint.js"),
    "-c", path.join(cwd, ".eslintrc.json"),
    "--max-warnings=0",
    ...files
  ];

  const d = new Deferred<void>;

  const child = spawn(
    execPath,
    args,
    {
      stdio: ["ignore", "inherit", "inherit", "ipc"],
    }
  );
  child.on('exit', code => code ? d.reject(code) : d.resolve());

  return d.promise;
}
