import path from "path";

import {
  runModule
} from "#utilities/source/runModule.js";

import {
  projectDir,
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

import {
  stageDir,
} from "../constants.js";

export default
async function runAPIDocumenter(): Promise<void>
{
  await runModule(
    path.join(projectDir, "node_modules/@microsoft/api-documenter/bin/api-documenter"),
    [
      "markdown",

      "--input-folder",
      pathToModule(stageDir, "typings-snapshot/extracted"),

      "--output-folder",
      path.join(projectDir, "docs/api")
    ]
  );
}