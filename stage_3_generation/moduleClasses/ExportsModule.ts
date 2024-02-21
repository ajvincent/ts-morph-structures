import {
  ExportManager
} from "#stage_two/snapshot/source/exports.js";

import {
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

import {
  stageDir
} from "../build/constants.js";

export const internalExports = new ExportManager(pathToModule(stageDir, "source/internal-exports.ts"));
export const publicExports = new ExportManager(pathToModule(stageDir, "source/exports.ts"));
