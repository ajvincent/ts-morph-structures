import path from "path";

import {
  chdir,
  cwd
} from 'node:process';

import { spawn } from 'child_process';

import {
  projectDir,
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

import type {
  PromiseRejecter,
  PromiseResolver,
} from "#utilities/source/PromiseTypes.js";

import {
  stageDir,
} from "../constants.js";

export default
async function runAPIDocumenter(): Promise<void>
{
  const popDir: string = cwd();
  try {
    chdir(projectDir);

    let resolve: PromiseResolver<void>, reject: PromiseRejecter;
    const apiPromise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    // cwd is important for ts-node/tsimp hooks to run.
    const apiDocumenter = spawn(
      process.argv0,
      [
        path.join(projectDir, "node_modules/@microsoft/api-documenter/bin/api-documenter"),
        "markdown",

        "--input-folder",
        pathToModule(stageDir, "typings-snapshot/extracted"),

        "--output-folder",
        path.join(projectDir, "docs/api")
      ],
      {
        cwd: projectDir,
      }
    );
    apiDocumenter.on("exit", code => code ? reject(code) : resolve());
    await apiPromise;
  }
  finally {
    chdir(popDir);
  }
}
